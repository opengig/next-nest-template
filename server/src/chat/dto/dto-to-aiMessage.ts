import {
  UserModelMessage,
  AssistantModelMessage,
  SystemModelMessage,
  ToolModelMessage,
  type ModelMessage,
  type TextPart,
  type FilePart,
} from 'ai';
import { Message as DbMessage } from 'prisma/client';

export const dbToAiMessage = (message: DbMessage): ModelMessage => {
  const baseMessage = {
    role: message.role as ModelMessage['role'],
  };

  if (message.role === 'user') {
    if (message.attachments && Array.isArray(message.attachments) && message.attachments.length > 0) {
      const contentParts: Array<TextPart | FilePart> = [{ type: 'text', text: message.content }];

      message.attachments.forEach((attachment: any) => {
        if (attachment.url) {
          contentParts.push({
            type: 'file',
            data: attachment.url,
            mediaType: attachment.contentType || 'application/octet-stream',
            filename: attachment.name,
          });
        }
      });

      return {
        ...baseMessage,
        role: 'user' as const,
        content: contentParts,
      } satisfies UserModelMessage;
    }

    return {
      ...baseMessage,
      role: 'user' as const,
      content: message.content,
    } satisfies UserModelMessage;
  }

  if (message.role === 'assistant') {
    return {
      ...baseMessage,
      role: 'assistant' as const,
      content: message.content,
    } satisfies AssistantModelMessage;
  }

  if (message.role === 'system') {
    return {
      ...baseMessage,
      role: 'system' as const,
      content: message.content,
    } satisfies SystemModelMessage;
  }

  if (message.role === 'tool') {
    return {
      ...baseMessage,
      role: 'tool' as const,
      content: [],
    } satisfies ToolModelMessage;
  }

  return {
    role: message.role as any,
    content: message.content,
  } as ModelMessage;
};
