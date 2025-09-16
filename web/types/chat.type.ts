interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  experimental_attachments?: {
    url: string;
    contentType: string;
    name: string;
  }[];
  parts?: Record<string, string>;
  createdAt?: Date;
}

export interface MessageDto {
  message: {
    id?: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;

    parts?: Record<string, string>;
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

export const availableModels: ModelOption[] = [
  // OpenAI Models
  { id: 'openai/gpt-5-chat-latest', name: 'GPT-5 Chat', provider: 'openai' },
  { id: 'openai/gpt-5-2025-08-07', name: 'GPT-5', provider: 'openai' },
  { id: 'openai/gpt-5-mini-2025-08-07', name: 'GPT-5 Mini', provider: 'openai' },
  { id: 'openai/gpt-4.1-2025-04-14', name: 'GPT-4.1', provider: 'openai' },
  { id: 'openai/o4-mini-2025-04-16', name: 'O4 Mini', provider: 'openai' },
  { id: 'openai/o3-mini-2025-01-31', name: 'O3 Mini', provider: 'openai' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'openai' },

  // Anthropic Models
  { id: 'anthropic/claude-sonnet-4-20250514', name: 'Claude Sonnet 4', provider: 'anthropic' },
  { id: 'anthropic/claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', provider: 'anthropic' },
  { id: 'anthropic/claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'anthropic' },

  // Google Models
  { id: 'google/gemini-2.5-pro-preview-06-05', name: 'Gemini 2.5 Pro', provider: 'google' },
  { id: 'google/gemini-2.5-flash-preview-05-20', name: 'Gemini 2.5 Flash', provider: 'google' },
  { id: 'google/gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google' },
];
