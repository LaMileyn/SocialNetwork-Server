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
    // one to one messages or group
    type: {
        type: String
    },
    messages : [
        { type : Schema.Types.ObjectId, ref : "Message"}
    ]
}, {timestamps: true})

module.exports = model("Conversation", ConversationSchema)