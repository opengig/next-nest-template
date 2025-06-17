import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { LokiOptions } from 'pino-loki';
import { config } from './common/config';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: false,
                translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                hideObject: true,
                ignore: 'pid,hostname',
                messageFormat: '[{req.id}] {req.method} {req.url} - {msg}  {res.statusCode} {responseTime}',
              },
            },
            ...(process.env.NODE_ENV !== 'development'
              ? [
                  {
                    target: 'pino-loki',
                    options: {
                      host: config.loki.host,
                      basicAuth: {
                        username: config.loki.username,
                        password: config.loki.password,
                      },
                      labels: {
                        app: process.env.NODE_ENV!,
                      },
                      replaceTimestamp: true,
                    } satisfies LokiOptions,
                  },
                ]
              : []),
          ],
        },
        redact: ['req.headers', 'res.headers'],
        level: 'debug',
      },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
