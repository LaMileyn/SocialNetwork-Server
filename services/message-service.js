const Message = require("./../models/message-model");
const conversationService = require("./../services/conversation-service")

class MessageService {
    async createMessage(message) {
        const newMess = await Message.create({
            ...message,
            sender : message.sender._id
        });
        await conversationService.updateLastMessage(message.conversation,newMess._id)
        return newMess;
    }

    async getMessages(conversationId) {
        const messages = await Message.find({conversation: conversationId}).populate("sender");
        return messages;
    }

    async deleteMessage(messageId) {
        const message = await Message.findById(messageId);
        // here we should in conversation last message back to  previous message
        await Message.deleteOne({_id: messageId});
    }

    async updateMessage(newData, messageId) {
        const message = await Message.findById(messageId)
        await conversationService.updateLastMessage(message.conversation,messageId)
        await Message.updateOne({_id: messageId}, newData);
    }
}

module.exports = new MessageService();