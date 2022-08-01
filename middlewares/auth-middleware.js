const ApiError = require("./../exceptions/api-error");
const tokenService = require("./../services/token-service");
module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            throw new ApiError.UnauthorizedError()
        }
        const token = authorizationHeader.split(" ")[1] // Bearer welcome --> welcome
        if (!token) {
            throw new ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateAccessToken(token);
        if (!userData){
            throw new ApiError.UnauthorizedError()
        }
        req.user = userData;
        next();
    } catch (err) {
        next(ApiError.UnauthorizedError())
    }
}