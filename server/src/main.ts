import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { config } from './common/config';
import { GlobalExceptionFilter } from './common/filters/global-exception-handler';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: '*',
	});
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
	SwaggerModule.setup('api', app, document);
	// Write the Swagger spec to a file
	writeFileSync('./swagger-spec.json', JSON.stringify(document));

	app.useGlobalFilters(new GlobalExceptionFilter());

	await app.listen(config.port);
}

void bootstrap();
