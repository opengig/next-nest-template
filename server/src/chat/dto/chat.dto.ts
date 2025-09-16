import { type UserModelMessage, type AssistantModelMessage } from 'ai';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetChatsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 10;
}

export class UpdateChatDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  experimental_attachments?: {
    url: string;
    contentType: string;
    name: string;
  }[];
  parts?: string[];
  createdAt?: Date;
}

export class MessageDto {
  @ApiProperty({ description: 'The message content and metadata' })
  @IsNotEmpty()
  message: ChatMessage;
}

export interface FileAttachment {
  url: string;
  contentType: string;
  name: string;
}
