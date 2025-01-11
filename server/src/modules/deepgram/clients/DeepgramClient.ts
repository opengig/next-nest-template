import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import {
	DeepgramConfig,
	SynthesisOptions,
	TranscriptionOptions,
} from "../types";
import { ConfigService } from "@nestjs/config";

export class DeepgramClient {
	private client: any;
	private defaultTranscriptionOptions: Required<TranscriptionOptions>;

	constructor(config: DeepgramConfig) {
		if (!config.apiKey) {
			throw new Error("Deepgram API key is required");
		}

		this.client = createClient(config.apiKey);

		// Set default options for transcription
		this.defaultTranscriptionOptions = {
			encoding: config.encoding || "mulaw",
			sampleRate: config.sampleRate || 8000,
			channels: config.channels || 1,
			model: config.model || "aura-stella-en",
			smartFormat: config.smartFormat ?? true,
			language: "en",
			detectLanguage: false,
			punctuate: true,
			profanityFilter: false,
		};
	}

	/**
	 * Creates a live transcription connection
	 */
	createLiveTranscription(options: Partial<TranscriptionOptions> = {}) {
		const transcriptionOptions: any = {
			encoding:
				options.encoding || this.defaultTranscriptionOptions.encoding,
			sample_rate:
				options.sampleRate ||
				this.defaultTranscriptionOptions.sampleRate,
			channels:
				options.channels || this.defaultTranscriptionOptions.channels,
			model: options.model || this.defaultTranscriptionOptions.model,
			smart_format:
				options.smartFormat ??
				this.defaultTranscriptionOptions.smartFormat,
			language:
				options.language || this.defaultTranscriptionOptions.language,
			detect_language:
				options.detectLanguage ||
				this.defaultTranscriptionOptions.detectLanguage,
			punctuate:
				options.punctuate ?? this.defaultTranscriptionOptions.punctuate,
			profanity_filter:
				options.profanityFilter ||
				this.defaultTranscriptionOptions.profanityFilter,
		};

		const connection = this.client.listen.live(transcriptionOptions);

		// Add error handling
		connection.on(LiveTranscriptionEvents.Error, (error) => {
			console.error("Deepgram transcription error:", error);
		});

		connection.on(LiveTranscriptionEvents.Close, () => {
			console.log("Deepgram transcription connection closed");
		});

		return connection;
	}

	/**
	 * Synthesizes text to audio
	 */
	async synthesizeAudio(
		text: string,
		options: Partial<SynthesisOptions> = {},
	): Promise<Buffer> {
		const synthOptions = {
			model: options.model || "aura-helios-en",
			encoding: options.encoding || "mulaw",
			container: options.container || "none",
			sample_rate: options.sampleRate || 8000,
			voice: options.voice,
		};

		try {
			const response = await this.client.speak.request(
				{ text },
				synthOptions,
			);

			const stream = await response.getStream();
			if (!stream) {
				throw new Error("Failed to get audio stream from Deepgram");
			}

			return this.getAudioBuffer(stream);
		} catch (error) {
			console.error("Deepgram synthesis error:", error);
			throw new Error("Failed to synthesize audio");
		}
	}

	/**
	 * Converts a ReadableStream to a Buffer
	 */
	private async getAudioBuffer(stream: ReadableStream): Promise<Buffer> {
		const reader = stream.getReader();
		const chunks: Uint8Array[] = [];

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				chunks.push(value);
			}

			return Buffer.concat(chunks);
		} catch (error) {
			console.error("Error reading audio stream:", error);
			throw new Error("Failed to process audio stream");
		} finally {
			reader.releaseLock();
		}
	}

	/**
	 * Get the underlying Deepgram client
	 */
	getClient(): any {
		return this.client;
	}

	/**
	 * Example of handling real-time transcription with automatic reconnection
	 */
	createRealtimeTranscription(
		options: Partial<TranscriptionOptions> = {},
		handlers: {
			onTranscript?: (transcript: string) => void;
			onError?: (error: Error) => void;
		} = {},
	) {
		let connection = this.createLiveTranscription(options);
		let reconnectAttempts = 0;
		const MAX_RECONNECT_ATTEMPTS = 3;

		const setupConnectionHandlers = () => {
			connection.on(LiveTranscriptionEvents.Transcript, (data) => {
				const transcript = data.channel?.alternatives?.[0]?.transcript;
				if (transcript) {
					handlers.onTranscript?.(transcript.trim());
				}
			});

			connection.on(LiveTranscriptionEvents.Error, async (error) => {
				handlers.onError?.(error);

				// Attempt to reconnect on error
				if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
					reconnectAttempts++;
					console.log(
						`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`,
					);

					connection.finish();
					connection = this.createLiveTranscription(options);
					setupConnectionHandlers();
				}
			});

			connection.on(LiveTranscriptionEvents.Close, () => {
				console.log("Transcription connection closed");
			});
		};

		setupConnectionHandlers();
		return connection;
	}
}
