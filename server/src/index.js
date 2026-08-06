require("dotenv").config();
const express = require("express");
const cors = require("cors");
const prisma = require("./config/db");
const authRoutes = require("./routes/auth.route");
const http = require("http");
const initSocket = require("./socket");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/app/health", (req, res) => {
  res.send("Welcome to the ChatterApp API!");
});

const httpServer = http.createServer(app);

const io = initSocket(httpServer);

// auth routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
