const router = require("express").Router();
const postController = require("./../controllers/post-controller");
const authMiddleware = require("./../middlewares/auth-middleware");
const validationMiddleware = require("./../middlewares/validation-middleware");

//create a post
router.post("/", authMiddleware, validationMiddleware, postController.create)
//update a post
router.put("/:id", authMiddleware, validationMiddleware, postController.update)
// get a post
router.get("/:id", authMiddleware, postController.getOne)
// like a post / dislike a post
router.put("/:id/like", authMiddleware, postController.likeDislike)
// delete a post
router.delete("/:id", authMiddleware, postController.delete)
// get timeline posts
router.get("/timeline/:userId", authMiddleware, postController.getFeedPosts)
// get user`s posts
router.get("/profile/:userId", authMiddleware, postController.getUserPosts)

module.exports = router;