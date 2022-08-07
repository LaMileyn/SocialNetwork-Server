


const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000"
    }
})
let users = [];
const addNewUser = (userId, socketId) => !users.some(user => user.userId === userId) && users.push({userId, socketId})
const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}
const getUser = (userId) => {
    let res = users.find(user => {
        return user.userId == userId
    });
    return res
}
io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
        // main list of users
        addNewUser(userId, socket.id)
        // creating special room for a user
        socket.join(userId)
        console.log("user joined: " + userId)
        io.emit("getUsers", users)
    })

    socket.on("typing", async (room,userId) => {
        // console.log("USER ID : " + userId)
        // const user = await User.findById(userId);
        //
        // console.log(user)
        socket.in(room).emit("typing",userId)
    })
    socket.on("stop-typing", (room,userId) => socket.in(room).emit("stop-typing",userId))

    socket.on("join-room", async (room) =>{
        // room equals to conversation._id //
        socket.join(room);
    })
    socket.on("message-room",(data) =>{
        const roomUsers = data.conversation.members;
        roomUsers.forEach( roomUser => {
            if( roomUser._id === data.sender.id) return;
            socket.in(roomUser._id).emit("room-messages",data)
        })
    });

    socket.on("disconnect", () => {
        removeUser(socket.id)
        io.emit("getUsers", users)
    })

    // socket.on("invite-to-room", async (room,myId,userId) =>{
    //     let currentConversation = await conversationService.getOneConversation(room);
    //     const user = getUser(userId)
    //     user && io.to(user.socketId).emit("send-invite-to-room",currentConversation);
    //     socket.broadcast.emit("new-room-member", {
    //         invitor : myId,
    //         invitedPerson : userId,
    //     });
    // })

})