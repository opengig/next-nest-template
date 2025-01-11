import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WebSocket } from "ws";

@Injectable()
export class ElevenLabsService {
	private readonly logger = new Logger(ElevenLabsService.name);
	private elevanlabsAgentId: string;

	constructor() {}

	createConversatinalAIWebSocketConnection(agentId: string) {
		this.logger.log("Creating live transcription connection");
		const connection = new WebSocket(
			`wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`,
		);

		connection.on("open", () =>
			this.logger.log("Connected to Conversational AI"),
		);
		connection.on("error", (error) =>
			this.logger.error("WebSocket error:", error),
		);
		connection.on("close", () => this.logger.log("Disconnected"));
		return connection;
	}

	handleMessage(message: any, twilioWs: WebSocket, streamSid: string): void {
		switch (message.type) {
			case "conversation_initiation_metadata":
				this.logger.log("Received conversation initiation metadata");
				break;

			case "audio":
				this.handleAudioMessage(message, twilioWs, streamSid);
				break;

			case "interruption":
				this.handleInterruption(twilioWs, streamSid);
				break;

			case "ping":
				this.handlePing(message, twilioWs);
				break;
		}
	}

	private handleAudioMessage(
		message: any,
		twilioWs: WebSocket,
		streamSid: string,
	): void {
		if (message.audio_event?.audio_base_64) {
			const audioData = {
				event: "media",
				streamSid,
				media: {
					payload: message.audio_event.audio_base_64,
				},
			};
			twilioWs.send(JSON.stringify(audioData));
		}
	}

	private handleInterruption(twilioWs: WebSocket, streamSid: string): void {
		twilioWs.send(JSON.stringify({ event: "clear", streamSid }));
	}

	private handlePing(message: any, twilioWs: WebSocket): void {
		if (message.ping_event?.event_id) {
			const pongResponse = {
				type: "pong",
				event_id: message.ping_event.event_id,
			};
			twilioWs.send(JSON.stringify(pongResponse));
		}
	}
}
