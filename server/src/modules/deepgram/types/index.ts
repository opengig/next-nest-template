export interface DeepgramConfig {
	apiKey: string;
	encoding?: string;
	sampleRate?: number;
	channels?: number;
	model?: string;
	smartFormat?: boolean;
}

export interface TranscriptionOptions {
	encoding?: string;
	sampleRate?: number;
	channels?: number;
	model?: string;
	smartFormat?: boolean;
	language?: string;
	detectLanguage?: boolean;
	punctuate?: boolean;
	profanityFilter?: boolean;
}

export interface SynthesisOptions {
	model?: string;
	encoding?: string;
	container?: string;
	sampleRate?: number;
	voice?: string;
}
