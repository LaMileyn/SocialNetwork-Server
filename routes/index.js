const userRoute = require("./users-router");
const postsRouter = require("./posts-router");
const Router = require("express").Router;

const router = new Router();

router.use("/users", userRoute)
router.use("/posts", postsRouter)

module.exports = router;