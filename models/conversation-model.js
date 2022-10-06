const {Schema, model} = require("mongoose");


const ConversationSchema = new Schema({
    members: [
        {type: Schema.Types.ObjectId, ref: "User"}
    ],
    image : { type : String, default: ""},
    title: {type: String},
    creator: {type: Schema.Types.ObjectId, ref: "User"},
    admins: [
        {type: Schema.Types.ObjectId, ref: "User"}
    ],
    isGroupChat: { type : Boolean, default: false},
    lastMessage : { type : Schema.Types.ObjectId, ref : "Message"}
}, {timestamps: true})

module.exports = model("Conversation", ConversationSchema)