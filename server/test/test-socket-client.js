const { io } = require("socket.io-client");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4ODU0OWI3Yy0xOTM0LTQ0YTUtYWE3Mi1kZjYzODQ4MGZjODIiLCJpYXQiOjE3ODYyMTUwMjUsImV4cCI6MTc4NjIxODYyNX0.i5ROLApGl_rYhGAQeF-bSWw9r5x6cfSslR-ZhFSdkR8";
const conversationId = "c464502b-d59e-4f28-b18d-d29c77e94525"; // create one via Postman first

const socket = io("http://localhost:5000", { auth: { token } });

socket.on("connect", () => {
  console.log("Connected:", socket.id);
  socket.emit("joinConversation", conversationId);

  setTimeout(() => {
    socket.emit("sendMessage", {
      conversationId,
      content: "Hello from test client!",
    });
  }, 1000);
});

socket.on("newMessage", (message) => {
  console.log("New message received:", message);
});

socket.on("errorEvent", (err) => {
  console.log("Socket error:", err);
});
