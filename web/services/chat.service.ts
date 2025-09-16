import { ApiClient } from '@/lib/api-client';
import { Chat, GetChatsQueryDto, UpdateChatDto, GetChatsResponse, MessageDto, FileAttachment } from '@/types/chat.type';

export class ChatService {
  static async getChats(query?: GetChatsQueryDto) {
    return await ApiClient.get<GetChatsResponse>(`/api/chats`, query);
  }

  static async createChat() {
    return await ApiClient.post<Chat>('/api/chats/new');
  }

  static async getChat(id: string) {
    return await ApiClient.get<Chat>(`/api/chats/${id}`);
  }

  static async updateChat(id: string, data: UpdateChatDto) {
    return await ApiClient.patch<Chat>(`/api/chats/${id}`, data);
  }

  static async deleteChat(id: string) {
    return await ApiClient.delete<boolean>(`/api/chats/${id}`);
  }
  static async uploadFiles(formData: FormData) {
    return await ApiClient.post<FileAttachment[]>('/api/chats/upload', formData);
  }
}
