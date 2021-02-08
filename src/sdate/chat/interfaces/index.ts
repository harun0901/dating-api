export interface PendingMessage {
  message: string;
  email: string;
  chatId?: string;
  recipientName: string;
  senderName: string;
  messageIds: string[];
}
