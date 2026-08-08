import { useState, useEffect } from "react";
import instance from "./api/axios";

import "./App.css";

function App() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    instance
      .get("/health")
      .then(() => setStatus("Backend connected ✅"))
      .catch(() => setStatus("Backend not reachable ❌"));
  }, []);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">{status}</h1>
      </div>
    </>
  );
}

export default App;
