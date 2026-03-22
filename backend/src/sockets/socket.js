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
      // Trim spaces and remove accidental literal quotes (e.g. "user_123" -> user_123)
      const cleanId = String(userId).trim().replace(/^["'](.+)["']$/, "$1");
      users[cleanId] = socket.id;
      console.log(`👤 User [${cleanId}] is now online`);
    });

    socket.on("send-message", (data) => {
      // Robust Parsing: If data is a string, parse it into JSON
      let payload = data;
      if (typeof data === "string") {
        try {
          payload = JSON.parse(data);
        } catch (e) {
          console.error("❌ Failed to parse message data:", data);
        }
      }

      const { receiverId } = payload;
      // Also clean quotes from receiverId just in case
      const cleanReceiverId = receiverId 
        ? String(receiverId).trim().replace(/^["'](.+)["']$/, "$1") 
        : "undefined";
      const receiverSocketId = users[cleanReceiverId];

      if (receiverSocketId) {
        console.log(`✉️ Sending message to [${cleanReceiverId}]`);
        io.to(receiverSocketId).emit("receive-message", payload);
      } else {
        console.log(`⚠️ User [${cleanReceiverId}] not found or offline`);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

export const getIo = () => io;