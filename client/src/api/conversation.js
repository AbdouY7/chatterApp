import api from "./axios";

export const getMyConversations = () => api.get("/conversations");
export const getOrCreateConversation = (otherUserId) =>
  api.post("/conversations", { otherUserId });
export const getMessages = (conversationId) =>
  api.get(`/conversations/${conversationId}/messages`);
