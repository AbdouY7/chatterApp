import { useAuth } from "../context/AuthContext";

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
}) {
  const { user } = useAuth();

  const getOtherParticipant = (conv) =>
    conv.participants.find((p) => p.userId !== user.id)?.user;

  return (
    <div className="w-72 border-r bg-white overflow-y-auto">
      {conversations.length === 0 && (
        <p className="text-gray-400 text-sm p-4">No conversations yet</p>
      )}
      {conversations.map((conv) => {
        const other = getOtherParticipant(conv);
        const lastMessage = conv.messages?.[0];
        return (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
              activeId === conv.id ? "bg-blue-50" : ""
            }`}>
            <p className="font-semibold text-gray-800">
              {other?.username || "Unknown"}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {lastMessage?.content || "No messages yet"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
