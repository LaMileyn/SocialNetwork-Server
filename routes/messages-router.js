const router = require("express").Router();
const authMiddleware = require("./../middlewares/auth-middleware");
const messageController = require("./../controllers/message-controller")

// message create
router.post("/", authMiddleware, messageController.createMessage);
// message update
router.put("/:id", authMiddleware, messageController.updateMessages);
//message delete
router.delete("/", authMiddleware, messageController.deleteMessages);
// get messages
router.get("/:conversationId", authMiddleware, messageController.getMessages)


module.exports = router;