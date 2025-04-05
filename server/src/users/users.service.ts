import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUser(filter: any) {
    return this.prismaService.users.findFirstOrThrow({
      where: filter,
    });
  }
}
