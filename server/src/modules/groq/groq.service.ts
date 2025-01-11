import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Groq } from "groq-sdk";

interface ChatMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

@Injectable()
export class GroqService {
	private readonly logger = new Logger(GroqService.name);
	private readonly groqClient: Groq;

	constructor(private readonly configService: ConfigService) {
		this.groqClient = new Groq({
			apiKey: this.configService.get<string>("GROQ_API_KEY"),
		});
	}

	async generateResponse(
		chatHistory: ChatMessage[],
		systemPrompt: string,
	): Promise<string> {
		try {
			const messages: any = [
				{
					role: "system",
					content: systemPrompt,
				},
				...chatHistory,
			];

			const completion = await this.groqClient.chat.completions.create({
				messages,
				model: "llama3-8b-8192",
				temperature: 1,
				max_tokens: 1024,
				top_p: 1,
				stream: false,
				stop: null,
			});

			return completion.choices[0].message.content;
		} catch (error) {
			this.logger.error("Error generating Groq response:", error);
			throw error;
		}
	}
}
