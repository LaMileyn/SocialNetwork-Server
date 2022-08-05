const conversationService = require("./../services/conversation-service");

class ConversationController {
    async getConversations(req,res,next){
        try{
            const data = await conversationService.getUserConversations(req.user.id)
            return res.status(200).json(data)
        }catch (err){
            next(err);
        }
    }
    async createConversation(req,res,next){
        try {
            const newOne = await conversationService.createConversation(req.body);
            return res.status(200).json(newOne);
        }catch (err){
            next(err);
        }
    }

    async getConversationWithUser(req,res,next){
        try {
            const conversation = await conversationService.getConversationWithUser(req.params.id,req.user.id)
            return res.status(200).json(conversation)
        }catch (err){
            next(err)
        }
    }
}

module.exports = new ConversationController();