require("dotenv").config();
const express = require("express");
const cors = require("cors");
const prisma = require("./config/db");
const authRoutes = require("./routes/auth.route");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/app/health", (req, res) => {
  res.send("Welcome to the ChatterApp API!");
});

// auth routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
