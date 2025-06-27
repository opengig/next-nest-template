import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from './common/config';
import { GlobalExceptionFilter } from './common/filters/global-exception-handler';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException({
          message: 'Cannot process request',
          data: errors,
        });
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API for NestJS')
    .setVersion('1.0')
    .addTag('API')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(config.port);
}

void bootstrap();
