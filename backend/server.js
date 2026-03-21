import http from "http";
import app from "./src/app.js";
import { initSocket } from "./src/sockets/socket.js";

const server = http.createServer(app);

// initialize socket
initSocket(server);

server.listen(3000, () => {
  console.log("Server running on port 3000");
});