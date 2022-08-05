const Conversation = require("./../models/conversation-model")

class ConversationService {
    async createConversation(data) {
        const newConversation = await Conversation.create(data);
        const result = await Conversation.findById(newConversation._id).populate("members")
        return result;
    }

    async getUserConversations(userId) {
        const conversations = await Conversation.find({members: {$in: [userId]}}).populate("members");
        return conversations;
    }

    async getConversationWithUser(userId, myId) {
        const conversations = await Conversation.find({$and: [{members: {$in: [userId]}}, {members: {$in: [myId]}}, { members: { $size : 2}}]}).populate("members")
        return conversations
    }

    async addNewMessage(conversationId,messageId){
        await Conversation.updateOne({ _id : conversationId}, { $push : { messages : messageId}})
    }
    async removeMessage(conversationId,messageId){
        await Conversation.updateOne({ _id : conversationId}, { $pull : { messages : messageId}})
    }
}

module.exports = new ConversationService();