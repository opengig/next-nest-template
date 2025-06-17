export type LLMModel = 'gemini';

export type RetryOptions = {
  /**
   * Maximum number of retry attempts
   */
  maxAttempts: number;
  /**
   * Delay between retry attempts in milliseconds
   */
  delayMs: number;
  /**
   * Retry strategy: 'fixed' or 'exponential'
   */
  strategy: 'fixed' | 'exponential';
};

export type LLMOptions = {
  /**
   * Temperature for the LLM
   */
  temperature: number;
  /**
   * LLM model to use
   */
  model: LLMModel;
  /**
   * Name of the model to use
   */
  modelName: string;
  /**
   * Retry options
   */
  retryOptions?: RetryOptions;
};
