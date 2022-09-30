const router = require("express").Router();
const userController = require("./../controllers/user-controller")
const { registerValidation, loginValidation } = require("./../validations/auth-validation")
const validation = require("./../middlewares/validation-middleware")
const authMiddleware = require('./../middlewares/auth-middleware');




router.get("/refresh", userController.toRefresh)
router.put("/", authMiddleware, userController.update)
router.delete("/:id", authMiddleware, userController.delete)
router.get("/:id", authMiddleware, userController.getOne)
router.put("/:id/follow",authMiddleware,userController.follow)
router.put("/:id/unfollow",authMiddleware,userController.unfollow)
router.post("/register",registerValidation,validation, userController.registration)
router.post("/login",loginValidation,validation, userController.login)
router.post("/logout", userController.logout)
router.get("/activate/:link", userController.activateAccount)
router.put("/friends/accept/:id",authMiddleware, userController.acceptFriendShip)
router.put("/friends/reject/:id",authMiddleware, userController.rejectFriendShip)
router.put("/friends/cancelFollowRequest/:id",authMiddleware, userController.cancelFollowRequest)
router.get("/friends/followersRequests",authMiddleware, userController.getUserFollowersRequest)
router.get("/friends/followingRequests",authMiddleware, userController.getUserFollowingRequest)
router.get("/friends/:id",authMiddleware, userController.getUserFriends)
router.get("/all/:id",authMiddleware,userController.allUsers)


module.exports = router;