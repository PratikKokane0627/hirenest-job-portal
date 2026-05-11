import { Server } from "socket.io";
import { getAllowedOrigins } from "./config/cors.js";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: getAllowedOrigins(),
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("join:user", (userId) => {
      socket.join(`user:${userId}`);
    });
  });
}

export function notifyUser(userId, event, payload) {
  if (io && userId) {
    io.to(`user:${userId}`).emit(event, payload);
  }
}
