const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const { searchUsers } = require("../controllers/user.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/search", searchUsers);

module.exports = router;
