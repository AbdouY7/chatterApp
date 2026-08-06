const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error: no token provided"));
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.userId;
      next();
    } catch (error) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId} (socket id: ${socket.id})`);
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId} `);
    });
  });

  return io;
}

module.exports = initSocket;
