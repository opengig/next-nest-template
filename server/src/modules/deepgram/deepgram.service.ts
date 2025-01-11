import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { WebSocket } from "ws";

@Injectable()
export class DeepgramService {
	private readonly logger = new Logger(DeepgramService.name);
	private readonly deepgramClient;

	constructor(private readonly configService: ConfigService) {
		this.deepgramClient = createClient(
			this.configService.get<string>("DEEPGRAM_API_KEY"),
		);
	}

	createLiveTranscription() {
		this.logger.log("Creating live transcription connection");
		const connection = this.deepgramClient.listen.live({
			encoding: "mulaw",
			sample_rate: 8000,
			channels: 1,
			model: "nova-2",
			smart_format: true,
		});

		this.logger.log("Live transcription connection created");
		return connection;
	}

	async synthesizeAudio(text: string): Promise<Buffer> {
		this.logger.log(`Starting audio synthesis for text: ${text}`);
		try {
			this.logger.log("Making request to Deepgram speak API...");
			const response = await this.deepgramClient.speak.request(
				{ text },
				{
					model: "aura-helios-en",
					encoding: "mulaw",
					container: "none",
					sample_rate: 8000,
				},
			);

			this.logger.log("Getting stream from response...");
			const stream = await response.getStream();
			if (stream) {
				this.logger.log("Got stream, getting audio buffer...");
				const buffer = await this.getAudioBuffer(stream);
				this.logger.log("Audio synthesis completed successfully");
				return buffer;
			} else {
				throw new Error("No stream returned from Deepgram");
			}
		} catch (error) {
			this.logger.error(`Error in synthesizeAudio: ${error.message}`);
			throw error;
		}
	}

	private async getAudioBuffer(response: any): Promise<Buffer> {
		const reader = response.getReader();
		const chunks: Uint8Array[] = [];

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
		}

		return Buffer.concat(chunks);
	}
}
