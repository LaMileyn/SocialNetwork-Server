const mongoose = require("mongoose");
const { Schema } = mongoose;

const TokenSchema = new Schema({
    user : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
    refreshToken : {type : String, required : true},
})


module.exports = mongoose.model("Token",TokenSchema)