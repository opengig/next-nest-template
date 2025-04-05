import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { UsersModule } from "./users/users.module";
import { S3Module } from "./s3/s3.module";

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (ConfigService: ConfigService) => {
        const isProduction = ConfigService.get("NODE_ENV") === "production";
        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: "pino-pretty",
                  options: {
                    singleLine: true,
                  },
                },
            level: isProduction ? "info" : "debug",
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot(),
    UsersModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
