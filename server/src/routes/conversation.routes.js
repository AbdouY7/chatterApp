const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const {
  getOrCreateConversation,
  getMyConversations,
  getMessagesHistory,
} = require("../controllers/conversation.controller");

const router = express.Router();

router.use(requireAuth);
// Route to get or create a conversation
router.post("/", getOrCreateConversation);

// Route to get all conversations for the authenticated user
router.get("/", getMyConversations);

// Route to get messages history of a conversation
router.get("/:conversationId/messages", getMessagesHistory);

module.exports = router;
