import { WebSocket, WebSocketServer } from "ws";
import { EventEmitter } from "events";
import { TwilioConfig, Connection, TwilioMessage } from "../types";

export class TwilioClient extends EventEmitter {
	private wss: WebSocketServer;
	private connections: Map<string, Connection>;

	constructor(config: TwilioConfig) {
		super();
		this.connections = new Map();

		// Initialize WebSocket server
		this.wss = new WebSocket.Server({
			port: config.port || 3000,
		});

		// Handle new WebSocket connections
		this.wss.on("connection", this.handleConnection.bind(this));
	}

	private handleConnection(ws: WebSocket): void {
		console.log("New WebSocket connection established");

		ws.on("message", async (message: string) => {
			try {
				const msg = JSON.parse(message) as TwilioMessage;

				switch (msg.event) {
					case "start":
						// New call starting
						this.handleStart(ws, msg.streamSid);
						break;

					case "media":
						// Receiving audio data
						if (msg.media) {
							this.handleMedia(msg.streamSid, msg.media);
						}
						break;

					case "stop":
						// Call ending
						this.handleStop(msg.streamSid);
						break;
				}
			} catch (error) {
				console.error("Error processing message:", error);
			}
		});

		ws.on("close", () => {
			// Clean up when connection closes
			this.handleConnectionClose(ws);
		});
	}

	private handleStart(ws: WebSocket, streamSid: string): void {
		// Store the connection
		this.connections.set(streamSid, { ws });

		// Emit start event for handlers
		this.emit("start", { streamSid });
	}

	private handleMedia(streamSid: string, media: any): void {
		// Convert base64 audio to buffer
		const audio = Buffer.from(media.payload, "base64");

		// Emit media event with audio data
		this.emit("media", {
			streamSid,
			audio,
			timestamp: media.timestamp,
			track: media.track,
		});
	}

	private handleStop(streamSid: string): void {
		// Emit stop event
		this.emit("stop", { streamSid });

		// Clean up connection
		this.connections.delete(streamSid);
	}

	private handleConnectionClose(ws: WebSocket): void {
		// Find and clean up all connections for this WebSocket
		for (const [streamSid, conn] of this.connections.entries()) {
			if (conn.ws === ws) {
				this.connections.delete(streamSid);
				this.emit("close", { streamSid });
			}
		}
	}

	// Method to send audio back to the caller
	async sendAudio(streamSid: string, audioBuffer: Buffer): Promise<void> {
		const connection = this.connections.get(streamSid);

		if (!connection || connection.ws.readyState !== WebSocket.OPEN) {
			throw new Error("Connection not found or WebSocket not open");
		}

		const message: TwilioMessage = {
			event: "media",
			streamSid,
			media: {
				track: "outbound",
				chunk: Date.now().toString(),
				timestamp: Date.now().toString(),
				payload: audioBuffer.toString("base64"),
			},
		};

		return new Promise((resolve) => {
			setTimeout(() => {
				connection.ws.send(JSON.stringify(message));
				resolve();
			}, 100);
		});
	}

	generateTwiMLResponse(wsUrl: string): string {
		return `
      <Response>
        <Connect>
          <Stream url='wss://${wsUrl}:${this.wss.options.port}' />
        </Connect>
      </Response>
    `;
	}

	close(): void {
		for (const [streamSid, connection] of this.connections) {
			connection.ws.close();
			this.connections.delete(streamSid);
		}
		this.wss.close();
	}
}
