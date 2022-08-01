const jwt = require("jsonwebtoken");
const Token = require("./../models/token-model")


class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, {expiresIn: "130m"})
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {expiresIn: "15d"})
        return {refreshToken, accessToken}
    }

    validateAccessToken(accessToken) {
        try {
            return jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);
        } catch (err) {
            null;
        }
    }

    validateRefreshToken(refreshToken) {
        try {
            return jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
        } catch (err) {
            null;
        }
    }

    async findTokenInDataBase(refreshToken) {
        const tokenData = await Token.findOne({refreshToken})
        return tokenData
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({user: userId})
        if (tokenData) {  // authorizing not for the first time
            tokenData.refreshToken = refreshToken;
            return tokenData.save()
        }
        const token = await Token.create({user: userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken) {
        const token = await Token.deleteOne({refreshToken})
        return token;
    }
}

module.exports = new TokenService()