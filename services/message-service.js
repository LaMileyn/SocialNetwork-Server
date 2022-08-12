const Message = require("./../models/message-model");
const conversationService = require("./../services/conversation-service")

class MessageService {
    async createMessage(message) {
        const newMess = await Message.create({
            ...message,
            sender : message.sender._id
        });
        await conversationService.updateLastMessage(message.conversation,newMess._id)
        const resultMessage = await Message.findById(newMess._id).populate("sender")
        return resultMessage;
    }

    async getMessages(conversationId) {
        const messages = await Message.find({conversation: conversationId}).populate("sender");
        return messages;
    }
    async deleteMessages(messages) {
        // here we should in conversation last message back to  previous message
        const ids = messages.map( mess => mess._id)
        await Message.deleteMany({_id : { $in : ids} })
        const allNewMessages = await Message.find({ conversation : messages[0].conversation});
        const lastMessageId = allNewMessages[allNewMessages.length - 1]
        await conversationService.updateLastMessage(messages[0].conversation,lastMessageId)
    }

    async updateMessage(newData, messageId) {
        const message = await Message.findById(messageId)
        await conversationService.updateLastMessage(message.conversation,messageId)
        await Message.updateOne({_id: messageId}, newData);
    }
}

module.exports = new MessageService();