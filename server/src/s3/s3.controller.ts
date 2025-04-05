// src/events/events-media.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  Res,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { S3Service } from "../s3/s3.service";
import { ResponseUtil } from "src/common/utils/response.util";

@Controller("medias")
export class S3Controller {
  constructor(private s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadMedia(@UploadedFile() file: Express.Multer.File) {
    try {
      const fileType = file.mimetype.startsWith("image/") ? "image" : "video";
      const key = `events/${fileType}/${Date.now()}-${file.originalname}`;

      const uploadedKey = await this.s3Service.uploadFile(file, key);
      return ResponseUtil.success({ key: uploadedKey });
    } catch (err) {
      return ResponseUtil.error(err);
    }
  }
}
