// ===== Request DTOs =====

export interface SendMessageDto {
  receiverId: number;
  listingId?: number;
  content: string;
}

// ===== Response DTOs =====

export interface MessageDto {
  messageId: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  content: string;
  isRead?: boolean;
  sentAt?: string;
}

export interface ConversationDto {
  otherUserId: number;
  otherUserName: string;
  lastMessage: string;
  lastMessageAt?: string;
  unreadCount: number;
}
