import { useState } from "react";
import { searchUsers } from "../api/users";
import { getOrCreateConversation } from "../api/conversation";

export default function NewChatModal({ onClose, onConversationCreated }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchUsers(value);
      setResults(res.data);
    } catch (err) {
      console.error("search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (userId) => {
    try {
      const res = await getOrCreateConversation(userId);
      onConversationCreated(res.data);
      onClose();
    } catch (err) {
      console.error("failed to start conversation:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">New chat</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by username or email..."
          className="w-full px-3 py-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />

        {loading && <p className="text-sm text-gray-400">Searching...</p>}

        <div className="max-h-64 overflow-y-auto">
          {results.map((u) => (
            <div
              key={u.id}
              onClick={() => handleSelectUser(u.id)}
              className="p-3 hover:bg-gray-50 rounded-md cursor-pointer flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                {u.username[0].toUpperCase()}
              </div>
              <span className="text-gray-800">{u.username}</span>
            </div>
          ))}
          {!loading && query && results.length === 0 && (
            <p className="text-sm text-gray-400 p-2">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
}
