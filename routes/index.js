const userRoute = require("./users-router");
const postsRouter = require("./posts-router");
const conversationRouter = require("./conversations-router");
const messageRouter = require("./messages-router")
const commentRouter = require("./comments-router")
const Router = require("express").Router;

const router = new Router();

router.use("/users", userRoute)
router.use("/conversations",conversationRouter)
router.use("/messages",messageRouter)
router.use("/posts", postsRouter)
router.use("/comments",commentRouter)

module.exports = router;