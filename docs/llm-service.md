# LLM Service Guide

This guide explains how to use the type-safe LLM (Large Language Model) service in the application.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Basic Usage](#basic-usage)
- [Advanced Configuration](#advanced-configuration)
- [Type Safety](#type-safety)
- [Retry Mechanism](#retry-mechanism)
- [Best Practices](#best-practices)

## Overview

The LLM service provides a type-safe way to interact with Large Language Models (currently supporting Gemini, you can add more into it) through an OpenAI-compatible API interface. It includes:
- Type-safe message handling
- Configurable retry mechanisms
- Support for both string and JSON responses
- Temperature control for response randomness
- Automatic error handling and retries

## Features

### Supported Models
Currently supports:
- Gemini (through OpenAI-compatible API)

### Response Formats
- String responses (default)
- JSON responses (with automatic parsing)

### Built-in Capabilities
- Automatic retry mechanism
- Error handling
- Response formatting
- Type safety

## Basic Usage

### Simple String Generation

```typescript
import { LLMService } from 'src/llm/llm.service';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class YourService {
  constructor(private readonly llmService: LLMService) {}

  async generateResponse(): Promise<string> {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'user',
        content: 'What is the capital of France?'
      }
    ];

    const response = await this.llmService.generate<string>(
      messages,
      'string'
    );

    return response;
  }
}
```

### JSON Response Generation

```typescript
interface WeatherResponse {
  temperature: number;
  conditions: string;
  forecast: string[];
}

async function getWeatherAnalysis(): Promise<WeatherResponse> {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: 'You are a weather analysis AI. Provide weather information in JSON format.'
    },
    {
      role: 'user',
      content: 'Analyze today\'s weather conditions.'
    }
  ];

  const response = await this.llmService.generate<WeatherResponse>(
    messages,
    'json',
    { temperature: 0.2 }
  );

  return response;
}
```

## Advanced Configuration

### LLM Options

```typescript
const options: LLMOptions = {
  temperature: 0.7,  // Controls response randomness (0.0 to 1.0)
  model: 'gemini'    // Specifies the LLM model to use
};

const response = await llmService.generate(
  messages,
  'string',
  options
);
```

### Retry Configuration

```typescript
const retryOptions: RetryOptions = {
  maxAttempts: 3,           // Maximum retry attempts
  delayMs: 1000,           // Delay between retries (ms)
  strategy: 'exponential'  // 'exponential' or 'fixed' delay
};

const response = await llmService.generate(
  messages,
  'string',
  { temperature: 0.5 },
  retryOptions
);
```

## Type Safety

The service provides full type safety:

1. Message format validation
2. Response type checking
3. Configuration options validation

### Example of Type Safety

```typescript
// ✅ Correct usage with type safety
interface UserProfile {
  name: string;
  age: number;
  interests: string[];
}

const response = await llmService.generate<UserProfile>(
  messages,
  'json',
  { temperature: 0.5 }
);

// TypeScript ensures response has correct shape
console.log(response.name);       // ✅ Valid
console.log(response.interests);  // ✅ Valid
console.log(response.invalid);    // ❌ TypeScript Error

```

## Retry Mechanism

The service includes a sophisticated retry mechanism for handling API failures:

### Fixed Delay Strategy
- Retries with a constant delay between attempts
- Good for predictable retry intervals

```typescript
const fixedRetryOptions: RetryOptions = {
  maxAttempts: 3,
  delayMs: 1000,
  strategy: 'fixed'
};
```

### Exponential Backoff Strategy
- Increases delay exponentially between attempts
- Better for handling temporary service issues

```typescript
const exponentialRetryOptions: RetryOptions = {
  maxAttempts: 3,
  delayMs: 1000,
  strategy: 'exponential'  // Delays: 1s, 2s, 4s
};
```

## Best Practices

1. **Message Construction**
   - Keep system messages clear and concise
   - Include relevant context in user messages
   - Use appropriate temperature settings based on need for creativity vs precision

2. **Error Handling**
   ```typescript
   try {
     const response = await llmService.generate(messages, 'string');
     // Handle success
   } catch (error) {
     // Handle failure after all retries
     console.error('LLM generation failed:', error);
   }
   ```

3. **Response Format Selection**
   - Use 'string' for simple text responses
   - Use 'json' when structured data is needed
   - Define clear interfaces for JSON responses

4. **Temperature Settings**
   - Use low temperature (0.0-0.3) for factual/consistent responses
   - Use medium temperature (0.3-0.7) for creative but controlled responses
   - Use high temperature (0.7-1.0) for maximum creativity

5. **Retry Configuration**
   - Use exponential backoff for production environments
   - Adjust maxAttempts based on operation criticality
   - Set appropriate delayMs based on your application's needs

6. **Resource Management**
   - Consider implementing rate limiting for high-traffic applications
   - Monitor API usage and response times
   - Implement proper error logging and monitoring
