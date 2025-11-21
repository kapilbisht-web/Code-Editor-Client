import { io } from "socket.io-client";

// Use your Render backend URL instead of localhost
const socket = io("https://code-editor-server-0ho1.onrender.com", {
transports: ["websocket", "polling"], // allow fallback
  reconnectionAttempts: 5,              // retry if fails
  reconnectionDelay: 1000  
});

export default socket;