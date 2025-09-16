import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ChatService } from './chat.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { RequestUser } from 'src/auth/dto/request-user.dto';
import { GetChatsQueryDto, MessageDto, UpdateChatDto } from './dto/chat.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('api/chats')
@ApiTags('Chats')
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post(':id/messages')
  async createMessage(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() body: MessageDto,
    @Res() res: Response,
  ) {
    return this.chatService.createMessage(user, id, body, res);
  }

  @Get()
  async getChats(@CurrentUser() user: RequestUser, @Query() query: GetChatsQueryDto) {
    return this.chatService.getChats(user.id, query);
  }

  @Post('new')
  async createChat(@CurrentUser() user: RequestUser) {
    return this.chatService.createChat(user.id);
  }

  @Get(':id')
  async getChat(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.chatService.getChat(user.id, id);
  }

  @Patch(':id')
  async updateChat(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() body: UpdateChatDto) {
    return this.chatService.updateChat(user.id, id, body);
  }

  @Delete(':id')
  async deleteChat(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.chatService.deleteChat(user.id, id);
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = [
          'image/png',
          'image/jpeg',
          'application/pdf',
          'image/svg+xml',
          'image/webp',
          'image/jpg',
          'image/heic',
          'image/heif',
        ];
        cb(null, allowed.includes(file.mimetype));
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  async uploadFiles(@CurrentUser() user: RequestUser, @UploadedFiles() files: Express.Multer.File[]) {
    return this.chatService.uploadFiles(user.id, files);
  }
}
