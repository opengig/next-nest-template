import { Groq } from "groq-sdk";
import { GroqConfig, ChatMessage } from "../types";

export class GroqClient {
	private client: Groq;
	private config: Required<GroqConfig>;

	constructor(config: GroqConfig) {
		this.config = {
			model: "llama3-8b-8192",
			temperature: 1,
			maxTokens: 1024,
			topP: 1,
			...config,
		};

		if (!this.config.apiKey) {
			throw new Error("Groq API key is required");
		}

		this.client = new Groq({
			apiKey: this.config.apiKey,
		});
	}

	async processChat(messages: ChatMessage[]): Promise<string> {
		const completion = await this.client.chat.completions.create({
			messages,
			model: this.config.model,
			temperature: this.config.temperature,
			max_tokens: this.config.maxTokens,
			top_p: this.config.topP,
			stream: false,
			stop: null,
		});

		return completion.choices[0].message.content;
	}
}
