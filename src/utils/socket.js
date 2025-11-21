import { io } from "socket.io-client";

// Use your Render backend URL instead of localhost
const socket = io("https://code-editor-server-0ho1.onrender.com", {
  transports: ["websocket"], // helps avoid polling issues
});

export default socket;