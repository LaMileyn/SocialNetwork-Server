const {Schema, model} = require("mongoose");


const MessageSchema = new Schema({
    sender : { type : Schema.Types.ObjectId, ref : "User" },
    conversation : { type : Schema.Types.ObjectId, ref : "Conversation" },
    seenBy : [
        { type : Schema.Types.ObjectId, ref : "User"}
    ],
    text : { type : String, required : true},
    updated : { type : Boolean, default : false}
}, { timestamps : true })

module.exports = model("Message",MessageSchema)