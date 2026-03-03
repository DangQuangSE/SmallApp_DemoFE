import { useEffect, useRef, useState, useCallback } from "react";
import {
  HubConnectionBuilder,
  type HubConnection,
  LogLevel,
  HubConnectionState,
} from "@microsoft/signalr";
import type { SendMessageDto, MessageDto } from "../../types/chat.types";

// SignalR hub URL — same origin as API but without /api suffix
const getHubUrl = (): string => {
  const base =
    import.meta.env.VITE_API_BASE_URL || "https://localhost:7258/api";
  // Remove trailing /api to get the server root
  return base.replace(/\/api\/?$/, "") + "/chathub";
};

export const useSignalR = (token: string | null) => {
  const connectionRef = useRef<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const connection = new HubConnectionBuilder()
      .withUrl(getHubUrl(), {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Information)
      .build();

    connection.onreconnecting(() => setIsConnected(false));
    connection.onreconnected(() => setIsConnected(true));
    connection.onclose(() => setIsConnected(false));

    connection
      .start()
      .then(() => {
        console.log("SignalR connected");
        setIsConnected(true);
      })
      .catch((err) => {
        console.error("SignalR connection error:", err);
        setIsConnected(false);
      });

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [token]);

  /** Send message via SignalR hub */
  const sendMessage = useCallback(async (dto: SendMessageDto) => {
    const conn = connectionRef.current;
    if (conn?.state === HubConnectionState.Connected) {
      await conn.invoke("SendMessage", dto);
    }
  }, []);

  /** Mark messages as read via SignalR hub */
  const markAsRead = useCallback(async (otherUserId: number) => {
    const conn = connectionRef.current;
    if (conn?.state === HubConnectionState.Connected) {
      await conn.invoke("MarkAsRead", otherUserId);
    }
  }, []);

  /** Listen for incoming messages */
  const onReceiveMessage = useCallback(
    (callback: (message: MessageDto) => void) => {
      connectionRef.current?.on("ReceiveMessage", callback);
      return () => {
        connectionRef.current?.off("ReceiveMessage", callback);
      };
    },
    [],
  );

  /** Listen for messages-read event */
  const onMessagesRead = useCallback((callback: (userId: number) => void) => {
    connectionRef.current?.on("MessagesRead", callback);
    return () => {
      connectionRef.current?.off("MessagesRead", callback);
    };
  }, []);

  return {
    isConnected,
    sendMessage,
    markAsRead,
    onReceiveMessage,
    onMessagesRead,
  };
};
