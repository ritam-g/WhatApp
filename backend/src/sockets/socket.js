import { Server } from "socket.io";

let io;
let users = {};

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log(`✅ User connected! ID: ${socket.id}`);

    // --- SIMPLE TEST: BROADCAST ---
    // Anyone sending to "message" will send to EVERYONE else.
    socket.on("message", (msg) => {
      console.log(`📡 Broadcast from ${socket.id}:`, msg);
      socket.broadcast.emit("message", msg);
    });

    // --- ADVANCED: JOIN & PRIVATE ---
    socket.on("join", (userId) => {
      users[userId] = socket.id;
      console.log(`👤 User [${userId}] is now online`);
    });

    socket.on("send-message", (data) => {
      const { receiverId } = data;
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", data);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

export const getIo = () => io;