export interface GroqConfig {
	apiKey: string;
	model?: string;
	temperature?: number;
	maxTokens?: number;
	topP?: number;
}

export interface ChatMessage {
	role: "system" | "user" | "assistant";
	content: string;
}
