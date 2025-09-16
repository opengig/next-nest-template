import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileAttachment, GetChatsQueryDto, MessageDto, UpdateChatDto } from './dto/chat.dto';
import { generateObject, smoothStream, streamText, createUIMessageStream, pipeUIMessageStreamToResponse } from 'ai';
import { Response } from 'express';
import { openai } from '@ai-sdk/openai';
import { InputJsonValue } from 'prisma/client/runtime/library';
import { dbToAiMessage } from './dto/dto-to-aiMessage';
import { z } from 'zod';
import { S3Service } from 'src/common/s3.service';
import { getPrompt } from './prompt';
import { RequestUser } from 'src/auth/dto/request-user.dto';
import { ToolsService } from './tools.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
    private readonly toolsService: ToolsService,
  ) {}

  async createMessage(user: RequestUser, chatId: string, body: MessageDto, res: Response) {
    const { message } = body;
    const chat = await this.getChat(user.id, chatId);

    await this.prisma.message.create({
      data: {
        chatId,
        content: message.content,
        role: message.role,
        parts: (message.parts || {}) as unknown as InputJsonValue,
        attachments: (message.experimental_attachments || null) as unknown as InputJsonValue,
      },
    });

    const convertedMessage = dbToAiMessage({
      id: message.id || '',
      role: message.role,
      content: message.content,
      parts: message.parts as any,
      attachments: message.experimental_attachments as any,
      reasoning: null,
      annotations: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      chatId: chatId,
    } as any);

    const messages = [...chat.messages, convertedMessage];

    if (chat.title === 'New Chat') {
      void this.generateAndChangeTitle(message.content, chatId);
    }

    const selectedModel = openai('gpt-4o');

    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: 'start' });

        const result = streamText({
          model: selectedModel,
          messages,
          system: getPrompt(user.name || 'Unknown'),
          experimental_transform: smoothStream({ chunking: 'word' }),
          tools: this.toolsService.getTools(),

          onFinish: async ({ text, finishReason, usage }) => {
            console.log('onFinish called');
            console.log('Generated text:', text);
            console.log('Finish reason:', finishReason);
            console.log('Usage:', usage);

            await this.prisma.message.create({
              data: {
                chatId,
                content: text,
                role: 'assistant',
                parts: {},
                attachments: null,
              },
            });
          },
          temperature: 0.5,
        });

        writer.merge(
          result.toUIMessageStream({
            sendStart: false,
            onError: (error) => {
              return error instanceof Error ? error.message : String(error);
            },
          }),
        );
      },
    });

    pipeUIMessageStreamToResponse({ stream, response: res });
  }

  async createChat(userId: string) {
    const chat = await this.prisma.chat.create({
      data: {
        userId,
      },
    });
    return chat;
  }

  async getChat(userId: string, chatId: string) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return {
      ...chat,
      messages: chat.messages.map(dbToAiMessage),
    };
  }

  async getChats(userId: string, query: GetChatsQueryDto) {
    const [chats, total] = await Promise.all([
      this.prisma.chat.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.chat.count({
        where: {
          userId,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / query.limit);
    const hasNextPage = query.page < totalPages;
    const hasPreviousPage = query.page > 1;

    return {
      chats,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async updateChat(userId: string, chatId: string, body: UpdateChatDto) {
    const result = await this.prisma.chat.updateMany({
      where: { id: chatId, userId },
      data: body,
    });
    if (result.count === 0) {
      throw new NotFoundException('Chat not found');
    }
    return this.prisma.chat.findUnique({ where: { id: chatId } });
  }

  async deleteChat(userId: string, chatId: string) {
    await this.prisma.message.deleteMany({
      where: { chatId },
    });

    const result = await this.prisma.chat.deleteMany({
      where: { id: chatId, userId },
    });
    if (result.count === 0) {
      throw new NotFoundException('Chat not found');
    }
    return { id: chatId } as const;
  }

  async uploadFiles(userId: string, files: Express.Multer.File[]): Promise<FileAttachment[]> {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const { url } = await this.s3Service.uploadFile(file, `cirro/${userId}/${file.originalname}`);
        return {
          url,
          contentType: file.mimetype,
          name: file.originalname,
        };
      }),
    );
    return uploadedFiles;
  }

  private async generateAndChangeTitle(userMessage: string, chatId: string) {
    const res = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        title: z.string(),
      }),
      prompt: `Generate a concise title (max 5 words) that summarizes the intent or topic of the following user message. Avoid punctuation unless necessary. 
			User message:
			${userMessage}`,
    });
    if (res.object.title) {
      await this.prisma.chat.update({
        where: { id: chatId },
        data: { title: res.object.title },
      });
    }
  }
}
