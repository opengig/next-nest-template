import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		LoggerModule.forRootAsync({
			imports: [],
			useFactory: () => {
				const isProduction = process.env.NODE_ENV === 'production';
				return {
					pinoHttp: {
						transport: isProduction
							? undefined
							: {
									target: 'pino-pretty',
									options: {
										singleLine: true,
									},
								},
						level: isProduction ? 'info' : 'debug',
					},
				};
			},
			inject: [],
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
