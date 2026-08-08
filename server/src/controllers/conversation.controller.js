const prisma = require("../config/db");

async function getOrCreateConversation(req, res) {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.body;
    if (!otherUserId) {
      return res.status(400).json({ error: "otherUserId is required" });
    }

    // Check if a conversation already exists between the two users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { participants: { some: { userId: userId } } },
          { participants: { some: { userId: otherUserId } } },
        ],
      },
      include: { participants: true },
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // If no existing conversation, create a new one
    const conversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        participants: {
          create: [{ userId: userId }, { userId: otherUserId }],
        },
      },
      include: { participants: true },
    });
    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error in getOrCreateConversation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getMyConversations(req, res) {
  try {
    const userId = req.user.id;
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId: userId } },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, username: true, avatarUrl: true } },
          },
        },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error in getMyConversations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// get messages history of a conversation

async function getMessagesHistory(req, res) {
  try {
    const { conversationId } = req.params;

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, username: true, avatarUrl: true } },
      },
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessagesHistory:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getOrCreateConversation,
  getMyConversations,
  getMessagesHistory,
};
