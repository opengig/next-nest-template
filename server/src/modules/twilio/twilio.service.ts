import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TwilioClient } from "./clients/TwilioClient";
import { EventEmitter } from "events";
import { TwilioEvents } from "./types";

@Injectable()
export class TwilioService implements OnModuleInit, OnModuleDestroy {
	private client: TwilioClient;
	private eventEmitter: EventEmitter;

	constructor(private configService: ConfigService) {
		this.eventEmitter = new EventEmitter();
		this.client = new TwilioClient({
			wsUrl: this.configService.get<string>("REPLIT_DEV_DOMAIN")!,
			port: this.configService.get<number>("PORT"),
		});
	}

	onModuleInit() {
		// Forward events from TwilioClient to our service's event emitter
		this.client.on("start", (data) =>
			this.eventEmitter.emit("start", data),
		);
		this.client.on("media", (data) =>
			this.eventEmitter.emit("media", data),
		);
		this.client.on("stop", (data) => this.eventEmitter.emit("stop", data));
		this.client.on("close", (data) =>
			this.eventEmitter.emit("close", data),
		);
		this.client.on("error", (error) =>
			this.eventEmitter.emit("error", error),
		);
	}

	onModuleDestroy() {
		this.client.close();
		this.eventEmitter.removeAllListeners();
	}

	// Event handling methods
	on<K extends keyof TwilioEvents>(
		event: K,
		listener: TwilioEvents[K],
	): void {
		this.eventEmitter.on(event, listener);
	}

	off<K extends keyof TwilioEvents>(
		event: K,
		listener: TwilioEvents[K],
	): void {
		this.eventEmitter.off(event, listener);
	}

	// Other methods
	generateTwiMLResponse(wsUrl?: string): string {
		return this.client.generateTwiMLResponse(wsUrl);
	}

	async sendAudio(streamSid: string, audioBuffer: Buffer): Promise<void> {
		return this.client.sendAudio(streamSid, audioBuffer);
	}
}
