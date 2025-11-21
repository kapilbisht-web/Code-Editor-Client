import { io } from "socket.io-client";

const socket = io("https://code-editor-server-0ho1.onrender.com", {
  transports: ["websocket", "polling"], // ✅ fallback allowed
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;