const { io } = require("socket.io-client");

// paste a real token from a Postman login response here
const token = "garbagetoken"; // Replace with a valid token for testing
const socket = io("http://localhost:5000", {
  auth: { token },
});

socket.on("connect", () => {
  console.log("Connected! Socket ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("Connection failed:", err.message);
});
