import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatController } from './chat.controller';
import { S3Service } from 'src/common/s3.service';
import { ToolsService } from './tools.service';

@Module({
  imports: [PrismaModule],
  controllers: [ChatController],
  providers: [ChatService, S3Service, ToolsService],
  exports: [ChatService],
})
export class ChatModule {}
