import { Server } from "socket.io";

let io
let users = {}

export function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    io.on("connection", (socket) => {
        console.log("a user connected", socket.id);

        // user join
        socket.on("join", (userId) => {
            users[userId] = socket.id
            console.log("user joined", userId);

        })

        // send message
        socket.on("send-message", (data) => {
            const { receiverId } = data
            const receiverSocketId = users[receiverId]
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive-message", data)
            }
        })
    })
}

export const getIo = () => io