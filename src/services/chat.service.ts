import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";
import type {
  SendMessageDto,
  MessageDto,
  ConversationDto,
} from "../types/chat.types";

export const chatService = {
  /** Send message (REST fallback) */
  send: async (dto: SendMessageDto): Promise<MessageDto> => {
    const response = await axiosInstance.post(API_ENDPOINTS.MESSAGES.SEND, dto);
    return response.data;
  },

  /** Get list of conversations */
  getConversations: async (): Promise<ConversationDto[]> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.MESSAGES.CONVERSATIONS,
    );
    return response.data;
  },

  /** Get chat history with a specific user */
  getConversation: async (otherUserId: number): Promise<MessageDto[]> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.MESSAGES.CONVERSATION_DETAIL(otherUserId),
    );
    return response.data;
  },

  /** Mark messages as read */
  markAsRead: async (otherUserId: number): Promise<void> => {
    await axiosInstance.patch(API_ENDPOINTS.MESSAGES.MARK_READ(otherUserId));
  },

  /** Get total unread message count */
  getUnreadCount: async (): Promise<number> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.MESSAGES.UNREAD_COUNT,
    );
    return response.data;
  },
};
