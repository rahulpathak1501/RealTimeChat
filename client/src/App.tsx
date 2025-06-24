import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

type Message = string;

const SERVER_URL = "https://realtimechat-backend-i6tk.onrender.com/";

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket: Socket = io(SERVER_URL);
    socketRef.current = socket;

    socket.on("message", (msg: Message) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinChat = (): void => {
    if (username && socketRef.current) {
      socketRef.current.emit("join", username);
      setJoined(true);
    }
  };

  const sendMessage = (): void => {
    if (message && socketRef.current) {
      socketRef.current.emit("chatMessage", message);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      {!joined ? (
        <>
          <h2>Join Chat</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: "8px", width: "80%" }}
          />
          <button
            onClick={joinChat}
            style={{ padding: "8px", marginLeft: "10px" }}
          >
            Join
          </button>
        </>
      ) : (
        <>
          <h2>Welcome, {username}</h2>
          <div
            style={{
              height: "300px",
              overflowY: "scroll",
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            {chat.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{ padding: "8px", width: "80%" }}
          />
          <button
            onClick={sendMessage}
            style={{ padding: "8px", marginLeft: "10px" }}
          >
            Send
          </button>
        </>
      )}
    </div>
  );
}

export default App;
