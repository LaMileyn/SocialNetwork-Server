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
    // we take userId and socketId from user
    socket.on("addUser", (userId) => {
        addNewUser(userId, socket.id)
        io.emit("getUsers", users)
    })


    //user leaving
    socket.on("disconnect", () => {
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
    //send message
    socket.on("sendMessage", (data) => {
        const currUsers = data.to.map(user => getUser(user));
        const {to, ...other} = data;
        currUsers.forEach(user => user && io.to(user.socketId).emit("getMessage", other))
    })
})