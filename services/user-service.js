const User = require("./../models/user-model")
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("./../dtos/user-dto")
const ApiError = require("./../exceptions/api-error")

class UserService {
    // generate tokens and userDto
    async generateUserResponse(user) {
        const userDto = new UserDto(user)
        //tokens
        const tokens = tokenService.generateTokens({...userDto}) // generating tokens for user
        await tokenService.saveToken(userDto.id, tokens.refreshToken) // saving refresh token for user
        return {
            ...tokens, userInfo: user
        }
    }

    async registration(email, username, password) {
        const candidate = await User.findOne({email});
        if (candidate) { // already exists in dataBase
            throw ApiError.BadRequest("User with current email exists")
        }
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password, salt)
        const activationLink = uuid.v4() // creating link for activation
        const newUser = await User.create({
            username,
            email,
            activationLink,
            password: hashedPassword,
        })
        await mailService.sendActivationEmail(email, `${process.env.API_URL}api/users/activate/${activationLink}`) // email send

        return this.generateUserResponse(newUser)
    }

    async login(email, password) {
        const candidate = await User.findOne({email});
        if (!candidate) { // not found in database ( but should be )
            throw ApiError.BadRequest("Invalid email or password")
        }
        const isPasswordValid = await bcrypt.compare(password, candidate.password); // checking for correct password
        if (!isPasswordValid) {
            console.log("invalid password")
            throw ApiError.BadRequest("Invalid email or password")
        }
        return this.generateUserResponse(candidate)


    }

    async logout(refreshToken) {
        const token = tokenService.removeToken(refreshToken);
        return token;
    }

    async linkActivation(activationLink) {
        let user = await User.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest("User not found")
        }
        user.activated = true;
        await user.save();
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        // check if this token is a real token

        const userData = tokenService.validateRefreshToken(refreshToken);
        // check if this token is in a database
        const tokenData = await tokenService.findTokenInDataBase(refreshToken);
        if (!userData || !tokenData) {
            throw ApiError.UnauthorizedError();
        }
        // giving data to user
        const user = await User.findById(userData.id);
        return this.generateUserResponse(user)


    }

    async updateUser(data, userId) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 6);
        }
        if (data.email) {
            let user = await User.findOne({email: data.email});
            if (user && (userId != user._id)) throw ApiError.BadRequest("Person with this email address already exists")
        }
        const updatedUser = await User.findOneAndUpdate({_id: userId}, {$set: data}, {new: true})
        return updatedUser
    }

    async incrementNotification(userId, field) {
        await User.findOneAndUpdate({_id: userId}, {})
    }

    async deleteUser(userId) {
        await User.findByIdAndDelete(userId);
    }

    async getOneUser(userId) {
        const user = await User.findById(userId);
        if (!user) throw ApiError.BadRequest("User does not exit")
        return user;
    }

    async followUser(userToFollowId, currentUserId) {
        const userToFollow = await User.findById(userToFollowId);
        const currentUser = await User.findById(currentUserId);
        if (userToFollowId === currentUserId) {
            throw ApiError.BadRequest("You cant follow yourself")
        }
        if (!userToFollow.followersRequests.includes(currentUser._id)) {
            await userToFollow.updateOne({$push: {followersRequests: currentUser._id}})
            await currentUser.updateOne({$push: {followingRequests: userToFollow._id}})
        } else {
            throw ApiError.BadRequest("You already following this user")
        }
    }

    async acceptFriendShip(currentUserId, requestUserId) {
        const currentUser = await User.findById(currentUserId);
        const requestUser = await User.findById(requestUserId);

        if (!currentUser.followers.includes(requestUserId)) {
            // deals with current user
            await currentUser.updateOne({$push: {followers: requestUserId}, $pull: {followersRequests: requestUserId}});
            // deals with requested user

            await requestUser.updateOne({$pull: {followingRequests: currentUserId}, $push: {followers: currentUserId}});
        } else {
            throw ApiError.BadRequest("User already is your friend")
        }
    }

    async rejectFriendShip(currentUserId, requestUserId) {
        const currentUser = await User.findById(currentUserId);
        const requestUser = await User.findById(requestUserId);

        // deals with current user
        await currentUser.updateOne({
            $push: {subscribers: requestUserId}
        });
        // deals with requested user
        await requestUser.updateOne({
            $pull: {followingRequests: currentUserId}
        });
    }

    async unFollowUser(userToUnFollowId, currentUserId) {
        const userToUnFollow = await User.findById(userToUnFollowId)
        const currentUser = await User.findById(currentUserId)
        if (userToUnFollow.followers.includes(currentUser._id)) {
            console.log(currentUserId, userToUnFollowId)
            await User.updateOne({_id: userToUnFollowId}, {$pull: {followers: currentUserId}})
            await User.updateOne({_id: currentUserId}, {$pull: {followers: userToUnFollowId}})
        } else {
            throw ApiError.BadRequest("You dont follow this user")
        }
    }

    async getUserFriends(userId) {
        const user = await User.findById(userId).populate(["followers"]);
        return user.followers;
    }

    async cancelFollowRequest(followSenderId, followReceiverId) {
        const followSender = await User.findById(followSenderId);
        const followReceiver = await User.findById(followReceiverId);

        await followSender.updateOne({$pull: {followingRequests: followReceiverId}})
        await followReceiver.updateOne({$pull: {followersRequests: followSenderId}})
    }

    async allUsers(query, userId) {
        const isFriends = query.isFriend;
        const keyword = query.search
            ? {
                $or: [
                    {username: {$regex: query.search, $options: "i"}},
                    {email: {$regex: query.search, $options: "i"}}
                ]
            }
            : {}
        let users;
        if (isFriends === "true") {
            users = await User
                .find(keyword)
                .find({
                    $and : [
                        {_id: {$ne: userId}},
                        {followers : { $in : [userId] }}
                    ]
                })
        } else {
            users = await User
                .find(keyword)
                .find({_id: {$ne: userId}})
        }
        return users
    }

    async getUserFollowersRequest(userId) {
        const users = await User.find({followingRequests: {$in: [userId]}});
        return users;
    }

    async getUserFollowingRequest(userId) {
        const users = await User.find({followersRequests: {$in: [userId]}});
        return users;
    }

    async addNewPhoto(id,photo){
        await User.findByIdAndUpdate(id,{
            $push : {
                photos : photo
            }
        })
    }

}

module.exports = new UserService();