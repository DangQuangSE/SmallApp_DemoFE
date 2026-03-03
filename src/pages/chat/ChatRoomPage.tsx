import { useState, useEffect, useRef, type FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import { chatService } from "../../services/chat.service";
import { ROUTES } from "../../constants/routes";
import type { MessageDto } from "../../types/chat.types";
import "./chat.css";

const ChatRoomPage: FC = () => {
  const { otherUserId } = useParams<{ otherUserId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { sendMessage, markAsRead, onReceiveMessage, conversations } =
    useChat();

  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const otherUid = Number(otherUserId);

  // Find the other user's name from conversations
  const otherUserName =
    conversations.find((c) => c.otherUserId === otherUid)?.otherUserName ??
    `User #${otherUid}`;

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để xem tin nhắn.");
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Load chat history
  useEffect(() => {
    if (!isAuthenticated || !otherUid) return;

    let cancelled = false;
    const load = async () => {
      try {
        const data = await chatService.getConversation(otherUid);
        if (!cancelled) setMessages(data);
        // Mark messages as read when opening conversation
        await markAsRead(otherUid);
      } catch {
        if (!cancelled) setMessages([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUid, isAuthenticated]);

  // Listen for real-time messages
  useEffect(() => {
    const cleanup = onReceiveMessage((msg: MessageDto) => {
      // Only add messages belonging to this conversation
      if (msg.senderId === otherUid || msg.receiverId === otherUid) {
        setMessages((prev) => [...prev, msg]);
        // Auto mark as read if sender is the other user
        if (msg.senderId === otherUid) {
          markAsRead(otherUid);
        }
      }
    });
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUid, onReceiveMessage]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Send a message */
  const handleSend = async () => {
    const content = input.trim();
    if (!content) return;

    setInput("");
    try {
      await sendMessage({ receiverId: otherUid, content });
    } catch {
      toast.error("Gửi tin nhắn thất bại.");
    }
  };

  /** Send on Enter (Shift+Enter for new line) */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (authLoading) {
    return <div className="chat-loading">Đang kiểm tra đăng nhập...</div>;
  }

  if (loading) {
    return <div className="chat-loading">Đang tải tin nhắn...</div>;
  }

  return (
    <div className="chat-room-page">
      {/* Header */}
      <div className="chat-room-header">
        <button
          className="chat-room-back"
          onClick={() => navigate(ROUTES.MESSAGES)}
        >
          ← Quay lại
        </button>
        <div className="chat-room-user">
          <div className="chat-room-avatar">
            {otherUserName.charAt(0).toUpperCase()}
          </div>
          <span className="chat-room-name">{otherUserName}</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="messages-empty">
            Bắt đầu cuộc trò chuyện với {otherUserName}
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === user?.userId;
            return (
              <div
                key={msg.messageId}
                className={`message ${isMine ? "mine" : "theirs"}`}
              >
                <div className="message-content">{msg.content}</div>
                <div className="message-meta">
                  <span className="message-time">
                    {msg.sentAt
                      ? new Date(msg.sentAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                  {isMine && (
                    <span className="message-status">
                      {msg.isRead ? "✓✓" : "✓"}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          rows={1}
          className="chat-input"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="chat-send-btn"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage;
