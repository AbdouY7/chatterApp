import { useEffect, useState } from "react";
import { getMyConversations } from "../api/conversation";
import { useAuth } from "../context/AuthContext";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import NewChatModal from "../components/NewChatModal";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    getMyConversations()
      .then((res) => setConversations(res.data))
      .catch((err) => console.error("failed to load conversations:", err));
  }, []);

  const handleConversationCreated = (newConv) => {
    // avoid duplicating if it already existed in the list
    setConversations((prev) => {
      const exists = prev.find((c) => c.id === newConv.id);
      return exists ? prev : [newConv, ...prev];
    });
    setActiveId(newConv.id);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center">
        <h1 className="font-bold text-gray-800">ChatterApp</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNewChat(true)}
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700">
            + New chat
          </button>
          <span className="text-sm text-gray-600">{user?.username}</span>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline">
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
        />
        <ChatWindow conversationId={activeId} />
      </div>

      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onConversationCreated={handleConversationCreated}
        />
      )}
    </div>
  );
}
