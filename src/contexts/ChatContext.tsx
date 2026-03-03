import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { useSignalR } from "../hooks/chat/useSignalR";
import { chatService } from "../services/chat.service";
import type {
  ConversationDto,
  SendMessageDto,
  MessageDto,
} from "../types/chat.types";

interface ChatContextType {
  conversations: ConversationDto[];
  totalUnread: number;
  isConnected: boolean;
  sendMessage: (dto: SendMessageDto) => Promise<void>;
  markAsRead: (otherUserId: number) => Promise<void>;
  refreshConversations: () => Promise<void>;
  onReceiveMessage: (
    callback: (msg: MessageDto) => void,
  ) => (() => void) | undefined;
  onMessagesRead: (
    callback: (userId: number) => void,
  ) => (() => void) | undefined;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const token = isAuthenticated ? localStorage.getItem("access_token") : null;
  const signalR = useSignalR(token);

  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);

  /** Load conversations + unread count from REST API */
  const refreshConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [convData, unreadData] = await Promise.all([
        chatService.getConversations(),
        chatService.getUnreadCount(),
      ]);
      setConversations(convData);
      setTotalUnread(unreadData);
    } catch {
      // ignore
    }
  }, [isAuthenticated]);

  // Load conversations when user authenticates
  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    const load = async () => {
      try {
        const [convData, unreadData] = await Promise.all([
          chatService.getConversations(),
          chatService.getUnreadCount(),
        ]);
        if (!cancelled) {
          setConversations(convData);
          setTotalUnread(unreadData);
        }
      } catch {
        // ignore
      }
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // Listen for new messages → refresh conversations & unread
  useEffect(() => {
    const cleanup = signalR.onReceiveMessage(() => {
      refreshConversations();
    });
    return cleanup;
  }, [signalR, refreshConversations]);

  // Listen for messages-read event → refresh conversations
  useEffect(() => {
    const cleanup = signalR.onMessagesRead(() => {
      refreshConversations();
    });
    return cleanup;
  }, [signalR, refreshConversations]);

  /** Send message — prefer SignalR, fallback to REST */
  const sendMessage = useCallback(
    async (dto: SendMessageDto) => {
      if (signalR.isConnected) {
        await signalR.sendMessage(dto);
      } else {
        await chatService.send(dto);
      }
    },
    [signalR],
  );

  /** Mark as read — prefer SignalR, fallback to REST */
  const markAsRead = useCallback(
    async (otherUserId: number) => {
      if (signalR.isConnected) {
        await signalR.markAsRead(otherUserId);
      } else {
        await chatService.markAsRead(otherUserId);
      }
      await refreshConversations();
    },
    [signalR, refreshConversations],
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        totalUnread,
        isConnected: signalR.isConnected,
        sendMessage,
        markAsRead,
        refreshConversations,
        onReceiveMessage: signalR.onReceiveMessage,
        onMessagesRead: signalR.onMessagesRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};
