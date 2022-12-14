const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const UserSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, max: 50, unique: true},
    age : { type: Number },
    status : { type : String},
    location : {
        city : {
            type : String,
        },
        country : {
            type : String
        }
    },
    password: {type: String, required: true, min: 6},
    activated: {type: Boolean, default: false},
    activationLink: {type: String},
    profilePicture: {type: String, default: ""},
    photos : [
        { type : String }
    ],
    coverPicture: {type: String, default: ""},
    posts : [
        { type : Schema.Types.ObjectId, ref : "Post"}
    ],
    followers: [
        {type: mongoose.Schema.Types.ObjectId, ref : "User"}
    ],
    followersRequests : [
        {type: mongoose.Schema.Types.ObjectId, ref : "User"}
    ],
    followingRequests : [
        {type: mongoose.Schema.Types.ObjectId, ref : "User"}
    ],
    isAdmin: {type: Boolean, default: false},
    desc: {type: String, max: 50},
    notifications : {
        friendsRequests : { type : Number, default : 0},
        unreadMessages : { type : Number, default : 0},
    }
    // notifications : {
    //     conversations : [
    //         { type : Schema.Types.ObjectId, ref : "Conversation", newMessages : { type : Number }}
    //     ],
    //     friendRequests : [
    //         { type : Schema.Types.ObjectId, ref : "User"}
    //     ]
    // },
    // meta : {
    //     interests : {
    //         activity : { type : String },
    //         personInterests : { type : String },
    //         belovedMusic : { type : String },
    //         belovedFilms : { type : String },
    //         belovedShows : { type : String },
    //         belovedBooks : { type : String },
    //         belovedGames : { type : String },
    //         aboutSelf : { type : String },
    //     },
    //     contacts : {
    //         mobileNumber : { type : String }
    //     }
    //
    // },
}, {timestamps: true})


module.exports = mongoose.model("User", UserSchema)