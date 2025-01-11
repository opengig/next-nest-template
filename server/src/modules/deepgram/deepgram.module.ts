import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DeepgramService } from "./deepgram.service";

@Module({
	imports: [ConfigModule],
	providers: [DeepgramService],
	exports: [DeepgramService],
})
export class DeepgramModule {}
