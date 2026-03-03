import { useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import { ROUTES } from "../../constants/routes";
import toast from "react-hot-toast";
import "./chat.css";

/** Format relative time from ISO date string */
const formatRelativeTime = (dateStr?: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return date.toLocaleDateString("vi-VN");
};

const ConversationsPage: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { conversations } = useChat();

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để xem tin nhắn.");
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading) {
    return <div className="chat-loading">Đang kiểm tra đăng nhập...</div>;
  }

  return (
    <div className="conversations-page">
      <h1 className="conversations-title">💬 Tin nhắn</h1>

      {conversations.length === 0 ? (
        <div className="conversations-empty">
          <p>Chưa có cuộc trò chuyện nào</p>
          <Link to={ROUTES.STORE} className="btn-primary">
            Khám phá cửa hàng
          </Link>
        </div>
      ) : (
        <div className="conversation-list">
          {conversations.map((conv) => (
            <Link
              key={conv.otherUserId}
              to={`/messages/${conv.otherUserId}`}
              className={`conversation-item ${conv.unreadCount > 0 ? "unread" : ""}`}
            >
              <div className="conv-avatar">
                {conv.otherUserName.charAt(0).toUpperCase()}
              </div>
              <div className="conv-body">
                <div className="conv-header">
                  <span className="conv-name">{conv.otherUserName}</span>
                  <span className="conv-time">
                    {formatRelativeTime(conv.lastMessageAt)}
                  </span>
                </div>
                <div className="conv-preview">
                  <span className="conv-last-msg">{conv.lastMessage}</span>
                  {conv.unreadCount > 0 && (
                    <span className="unread-badge">{conv.unreadCount}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;
