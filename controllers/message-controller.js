const messageService = require("./../services/message-service");

class MessageController {
    async createMessage(req, res, next) {
        try {
            const newMessage = await messageService.createMessage(req.body);
            return res.status(200).json(newMessage);
        } catch (err) {
            next(err);
        }
    }

    async getMessages(req, res, next) {
        try {
            const messages = await messageService.getMessages(req.params.conversationId);
            return res.status(200).json(messages);
        } catch (err) {
            next(err);
        }
    }

    async deleteMessages(req, res, next) {
        try {
            await messageService.deleteMessages(req.body);
            return res.status(200).json("Deleted")
        } catch (err) {
            next(err);
        }
    }

    async updateMessages(req,res,next){
        try {
            const updatedData = await messageService.updateMessage(req.body,req.params.id);
            return res.status(200).json("Updated");
        }catch (err){
            next(err);
        }
    }
}

module.exports = new MessageController();