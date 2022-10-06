const {Schema, model} = require("mongoose");


const CommentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId, ref: "Post"
    },
    text : {
        type : String
    },
    likes: {
        type: [ { user : Schema.Types.ObjectId, ref : "User"}]
    },
    parentComment : {
        type: Schema.Types.ObjectId, ref: "Comment"
    },
    user : {
        type: Schema.Types.ObjectId, ref: "User"
    }
}, {
    timestamps : true
})

module.exports = model("Comment",CommentSchema)