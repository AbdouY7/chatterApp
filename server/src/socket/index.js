const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

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

    socket.on("joinConversation", async (conversationId) => {
      const paticipant = await prisma.conversationParticipant.findFirst({
        where: {
          conversationId,
          userId: socket.userId,
        },
      });
      if (!paticipant) {
        console.log(
          `User ${socket.userId} is not a participant of conversation ${conversationId}`,
        );
        return socket.emit(
          "error",
          "You are not a participant of this conversation",
        );
      }
      socket.join(conversationId);
      console.log(
        `User ${socket.userId} joined conversation ${conversationId}`,
      );
    });

    // send new message to a conversation

    socket.on("sendMessage", async ({ conversationId, content }) => {
      try {
        if (!conversationId || !content) {
          return socket.emit(
            "error",
            "conversationId and content are required",
          );
        }

        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            conversationId,
            userId: socket.userId,
          },
        });
        if (!participant) {
          return socket.emit(
            "error",
            "You are not a participant of this conversation",
          );
        }

        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: socket.userId,
            content: content.trim(),
          },
          include: {
            sender: { select: { id: true, username: true, avatarUrl: true } },
          },
        });

        io.to(conversationId).emit("newMessage", message);
      } catch (error) {
        console.error("Error in sendMessage:", error);
        return socket.emit("error", "Failed to send message");
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId} `);
    });
  });

  return io;
}

module.exports = initSocket;
