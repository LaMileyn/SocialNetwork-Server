module.exports = class UserDto {
    email;
    id;
    isActivated;
    username;
    avatar;
    constructor(model) { // only properties that we need
        this.email = model.email
        this.id = model._id
        this.isActivated = model.activated
        this.username = model.username
        this.avatar = model.profilePicture
    }
}