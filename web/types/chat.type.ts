interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  experimental_attachments?: {
    url: string;
    contentType: string;
    name: string;
  }[];
  parts?: Record<string, unknown>;
  createdAt?: Date;
}

export interface MessageDto {
  message: {
    id?: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;

    parts?: Record<string, unknown>;
    experimental_attachments?: {
      url: string;
      contentType: string;
      name: string;
    }[];
  };
}

export interface FileAttachment {
  url: string;
  contentType: string;
  name: string;
}

export interface Chat {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

export interface GetChatsQueryDto extends Record<string, unknown> {
  page?: number;
  limit?: number;
}

export interface UpdateChatDto {
  title: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetChatsResponse {
  chats: Chat[];
  pagination: PaginationMeta;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google';
}
