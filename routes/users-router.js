const router = require("express").Router();
const userController = require("./../controllers/user-controller")
const { registerValidation, loginValidation } = require("./../validations/auth-validation")
const validation = require("./../middlewares/validation-middleware")
const authMiddleware = require('./../middlewares/auth-middleware');

//refresh
router.get("/refresh", userController.toRefresh)
//update user
router.put("/:id", authMiddleware, userController.update)
//delete user
router.delete("/:id", authMiddleware, userController.delete)
//get a user
router.get("/:id", authMiddleware, userController.getOne)
//follow a user
router.put("/:id/follow",authMiddleware,userController.follow)
//unFollow a user
router.put("/:id/unfollow",authMiddleware,userController.unfollow)
//register
router.post("/register",registerValidation,validation, userController.registration)
//login
router.post("/login",loginValidation,validation, userController.login)
//logout
router.post("/logout", userController.logout)
//activate
router.get("/activate/:link", userController.activateAccount)
//get friends
router.get("/friends/:id",authMiddleware, userController.getUserFriends)
//accept to friend
router.put("/friends/accept/:id",authMiddleware, userController.acceptFriendShip)
// reject friendship
router.put("/friends/reject/:id",authMiddleware, userController.rejectFriendShip)
//cancel follow request
router.put("/friends/cancelFollowRequest/:id",authMiddleware, userController.cancelFollowRequest)


module.exports = router;