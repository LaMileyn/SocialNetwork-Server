const router = require("express").Router()
const conversationController = require("./../controllers/conversation-controller")
const authMiddleware = require('./../middlewares/auth-middleware');

router.get("/", authMiddleware, conversationController.getConversations)
router.post("/", authMiddleware, conversationController.createConversation)
router.get("/:id", authMiddleware, conversationController.getConversationWithUser)

module.exports = router;