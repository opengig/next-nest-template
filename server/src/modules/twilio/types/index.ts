import { WebSocket } from "ws";

export interface TwilioConfig {
	wsUrl: string; // The WebSocket URL for Twilio to connect to
	port?: number; // Port for WebSocket server
}

export interface Connection {
	ws: WebSocket; // WebSocket connection instance
}

export interface MediaPayload {
	track: string; // 'inbound' or 'outbound'
	chunk: string; // Chunk identifier
	timestamp: string; // Media timestamp
	payload: string; // Base64 encoded audio data
}

export interface TwilioMessage {
	event: "start" | "media" | "stop"; // Type of Twilio event
	streamSid: string; // Unique identifier for the call stream
	media?: MediaPayload; // Present only for 'media' events
}

export interface TwilioEvents {
	start: (data: { streamSid: string }) => void;
	media: (data: { streamSid: string; audio: Buffer }) => void;
	stop: (data: { streamSid: string }) => void;
	close: (data: { streamSid: string }) => void;
	error: (error: Error) => void;
}
