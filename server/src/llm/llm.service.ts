import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { config } from 'src/common/config';
import { safeParseJson } from 'src/common/utils/parse.utils';
import { RetryOptions, LLMOptions, LLMModel } from './types/llm';

/**
 * Service for handling Large Language Model (LLM) interactions.
 * Currently supports Gemini model through OpenAI-compatible API interface.
 * Provides retry mechanisms and response formatting capabilities.
 */
@Injectable()
export class LLMService {
	/**
	 * OpenAI client instance configured for Gemini API
	 * @private
	 */
	private readonly openai_gemini: OpenAI;

	/**
	 * Initializes the LLM service with Gemini configuration
	 * Wraps the OpenAI client with LangSmith for monitoring and tracking
	 */
	constructor() {
		this.openai_gemini = new OpenAI({
			apiKey: config.llm.gemini.apiKey,
			baseURL: config.llm.gemini.baseUrl,
		});
	}

	/**
	 * Executes an operation with retry logic
	 * @private
	 * @template T - The type of the operation result
	 * @param {() => Promise<T>} operation - The async operation to execute
	 * @param {RetryOptions} options - Retry configuration options
	 * @param {number} options.maxAttempts - Maximum number of retry attempts (default: 3)
	 * @param {number} options.delayMs - Base delay between retries in milliseconds (default: 1000)
	 * @param {'exponential' | 'fixed'} options.strategy - Retry delay strategy (default: 'exponential')
	 * @returns {Promise<T>} The result of the successful operation
	 * @throws {Error} If all retry attempts fail
	 */
	private async retryOperation<T>(
		operation: () => Promise<T>,
		options: RetryOptions = { maxAttempts: 3, delayMs: 1000, strategy: 'exponential' },
	): Promise<T> {
		let lastError: Error | null = null;
		for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
			try {
				console.log(`Attempt ${attempt} of ${options.maxAttempts}...`);
				return await operation();
			} catch (error) {
				lastError = error as Error;
				if (attempt === options.maxAttempts) break;

				const delay = options.strategy === 'exponential' ? Math.pow(2, attempt - 1) * options.delayMs : options.delayMs;

				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
		if (lastError) {
			throw lastError;
		}
		throw new Error('Failed to complete operation');
	}

	/**
	 * Retrieves the appropriate LLM client based on the model type
	 * @param {LLMModel} model - The LLM model identifier
	 * @returns {OpenAI} The configured OpenAI client for the specified model
	 * @throws {Error} If the requested model is not supported
	 */
	public getModel(model: LLMModel): OpenAI {
		switch (model) {
			case 'gemini':
				return this.openai_gemini;
			default:
				throw new Error(`Unsupported model`);
		}
	}

	/**
	 * Generates content using the specified LLM model
	 * @template T - The expected response type (string or object)
	 * @param {ChatCompletionMessageParam[]} messages - The conversation messages to send to the model
	 * @param {'string' | 'json'} responseFormat - The desired response format (default: 'string')
	 * @param {LLMOptions} options - Model configuration options
	 * @param {number} options.temperature - Controls randomness in the response (0.0 to 1.0)
	 * @param {LLMModel} options.model - The LLM model to use (default: 'gemini')
	 * @param {RetryOptions} retryOptions - Configuration for retry behavior
	 * @returns {Promise<T>} The generated content in the specified format
	 * @throws {Error} If the generation fails after all retry attempts
	 */
	public async generate<T extends string | object>(
		messages: ChatCompletionMessageParam[],
		responseFormat: 'string' | 'json' = 'string',
		options: LLMOptions = { temperature: 0.0, model: 'gemini' },
		retryOptions: RetryOptions = { maxAttempts: 3, delayMs: 1000, strategy: 'fixed' },
	): Promise<T> {
		const response = await this.retryOperation(async () => {
			return await this.getModel(options.model).chat.completions.create({
				model: 'gpt-4o',
				messages,
				temperature: options.temperature,
				response_format: responseFormat === 'json' ? { type: 'json_object' } : undefined,
			});
		}, retryOptions);
		if (responseFormat === 'json') {
			const exactResponse = response.choices[0].message.content ?? '{}';
			const parsedContent = safeParseJson(exactResponse);
			return parsedContent as T;
		}
		return response?.choices[0]?.message?.content as T;
	}
}
