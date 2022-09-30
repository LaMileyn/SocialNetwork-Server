const Conversation = require("./../models/conversation-model")

class ConversationService {
    async createConversation(data) {
        const newConversation = await Conversation.create(data);
        const result = await Conversation.findById(newConversation._id).populate("members")
        return result;
    }

    async getUserConversations(userId) {
        const conversations = await Conversation.find({members: {$in: [userId]}})
            .populate("members")
            .populate({
                path: "lastMessage",
                populate: {
                    path: "sender"
                }
            });
        return conversations;
    }

    async getConversationWithUser(userId, myId) {
        const conversation = await Conversation
            .findOne({$and: [{members: {$in: [userId]}}, {members: {$in: [myId]}}, {members: {$size: 2}}]})
            .findOne({isGroupChat : { $eq : false }})
            .populate("members")
        return conversation
    }

    async getConversationUsers(coversationId) {
        const users = await Conversation.findById(coversationId).populate("members")
        return users;
    }

    async updateLastMessage(conversationId, messageId) {
        await Conversation.updateOne({_id: conversationId}, {$set: {lastMessage: messageId}})
    }
}

module.exports = new ConversationService();