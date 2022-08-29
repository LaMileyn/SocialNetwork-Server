const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
    user : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true,},
    desc : {type : String, max : 500},
    img : {type : String},
    likes : [
        { type : Schema.Types.ObjectId, ref : "User" }
    ],
    isFixed : { type : Boolean, default: false},
    views : { type : Number, default : 0}
}, { timestamps : true })


module.exports = mongoose.model("Post",PostSchema)