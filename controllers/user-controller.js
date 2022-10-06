const userService = require("./../services/user-service");


class UserController {
    async registration(req, res, next) {
        try {
            const {email, password, username} = req.body;
            const userData = await userService.registration(email, username, password);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(200).json(userData);
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.status(200).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.body;
            const token = await userService.logout(refreshToken);
            res.clearCookie("refreshToken");
            return res.status(200).json(token)
        } catch (err) {
            next(err);
        }
    }

    async toRefresh(req, res, next) {
        try {
            const refreshToken = req.headers.cookie.split("=")[1];
            const userData = await userService.refresh(refreshToken);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.status(200).json(userData)
        } catch (err) {
            next(err)
        }
    }

    async activateAccount(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.linkActivation(activationLink);
            return res.redirect(process.env.CLIENT_API_URL)
        } catch (e) {
            next(e)
        }

    }

    async update(req, res, next) {
        try {
            const updatedUser = await userService.updateUser(req.body, req.user.id);
            return res.status(200).json(updatedUser)
        } catch (err) {
            next(err)
        }
    }

    async delete(req, res, next) {
        try {
            await userService.deleteUser(req.params.id)
            return res.status(200).json("Account has been deleted")
        } catch (err) {
            next(err);
        }
    }

    async getOne(req, res, next) {
        try {
            const user = await userService.getOneUser(req.params.id);
            return res.status(200).json(user)
        } catch (err) {
            next(err)
        }
    }

    async follow(req, res, next) {
        try {
            await userService.followUser(req.params.id, req.user.id)
            return res.status(200).json("Followed")
        } catch (err) {
            next(err)
        }
    }

    async unfollow(req, res, next) {
        try {
            await userService.unFollowUser(req.params.id, req.user.id)
            return res.status(200).json("Unfollowed")
        } catch (err) {
            next(err);
        }
    }

    async getUserFriends(req, res, next) {
        try {
            const friends = await userService.getUserFriends(req.params.id);
            return res.status(200).json(friends)
        } catch (err) {
            next(err)
        }
    }

    async acceptFriendShip(req, res, next) {
        try {
            await userService.acceptFriendShip(req.user.id, req.params.id);
            return res.status(200).json("accepted")
        } catch (err) {
            next(err)
        }
    }

    async rejectFriendShip(req, res, next) {
        try {
            await userService.rejectFriendShip(req.user.id, req.params.id);
            return res.status(200).json("accepted")
        } catch (err) {
            next(err)
        }
    }

    async cancelFollowRequest(req, res, next) {
        try {
            await userService.cancelFollowRequest(req.user.id,req.params.id)
            return res.status(200).json("request cancelled")
        } catch (err) {
            next(err)
        }
    }

    async allUsers(req,res,next){
        try {
            const users = await userService.allUsers(req.query,req.params.id)
            res.status(200).json(users)
        }catch (err){
            next(err);
        }
    }

    async getUserFollowersRequest(req,res,next){
        try {
            const users = await userService.getUserFollowersRequest(req.user.id)
            return res.status(200).json(users)
        }catch (err){
            next(err)
        }
    }
    async getUserFollowingRequest(req,res,next){
        try {
            const users = await userService.getUserFollowingRequest(req.user.id)
            return res.status(200).json(users)
        }catch (err){
            next(err)
        }
    }
    async addPhoto(req,res,next){
        try {
            await userService.addNewPhoto(req.user.id,req.body.photo)
            return res.status(200).json(req.body)
        }catch (err){
            next(err)
        }
    }


}

module.exports = new UserController();