const userService = require('./../services/user-service');
const conversationService = require('./../services/conversation-service');


module.exports = function initialyseSocket(io) {
    let users = [];
    const addNewUser = (userId, socketId) => !users.some(user => user.userId === userId) && users.push({
        userId,
        socketId
    })
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
            io.emit("getUsers", users)
        })

        socket.on("typing", async (room, userId) => {
            const user = await userService.getOneUser(userId)
            const conversationUsers = await conversationService.getConversationUsers(room);
            conversationUsers.members.forEach(person => {
                if (person._id == userId) return;
                const currUser = getUser(person._id);
                if (currUser) {
                    io.to(currUser.socketId).emit("typing", room, user)
                }
            })
        })
        socket.on("stop-typing", async (room, userId) => {
            const conversationUsers = await conversationService.getConversationUsers(room);
            conversationUsers.members.forEach(person => {
                if (person._id == userId) return;
                const currUser = getUser(person._id);
                if (currUser) {
                    io.to(currUser.socketId).emit("stop-typing", room, userId)
                }
            })
        })
        socket.on("join-room", async (room) => {
            socket.join(room);
        })
        socket.on("leave-room", async (room) => {
            socket.leave(room)
        })
        socket.on("message-room", (data) => {
            const roomUsers = data.conversation.members;
            roomUsers.forEach(roomUser => {
                if (roomUser._id === data.sender._id) return;
                socket.in(roomUser._id).emit("room-messages", data)
            })
        })
        socket.on("message-update",(data) =>{
            console.log(data)
            const roomUsers = data.conversation.members;
            roomUsers.forEach(roomUser => {
                if (roomUser._id === data.sender._id) return;
                socket.in(roomUser._id).emit("room-message-update", data)
            })
        })
        socket.on("message-delete",(data) =>{
            const roomUsers = data.conversation.members;
            roomUsers.forEach(roomUser => {
                if (roomUser._id === data.sender._id) return;
                socket.in(roomUser._id).emit("room-message-delete", data)
            })
        })

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
        //         invitedPerson : userId
        //     });
        // })
    })
}
