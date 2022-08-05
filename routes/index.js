const userRoute = require("./users-router");
const postsRouter = require("./posts-router");
const converstaionRouter = require("./conversations-router");
const messageRouter = require("./messages-router")
const Router = require("express").Router;

const router = new Router();

router.use("/users", userRoute)
router.use("/conversations",converstaionRouter)
router.use("/messages",messageRouter)
router.use("/posts", postsRouter)

module.exports = router;