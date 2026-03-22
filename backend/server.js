import { createServer } from "http";
import dotenv from "dotenv";
import app from "./src/app.js";
import { initSocket } from "./src/sockets/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = createServer(app);

// initialize socket
initSocket(server);

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Please kill the process or use a different port.`);
    process.exit(1);
  } else {
    throw err;
  }
});
