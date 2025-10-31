import { Injectable, Logger } from '@nestjs/common';
import { tool, generateText, Tool } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { getSearchAgentPrompt } from './prompt';

export interface ToolStateCallback {
  onStateChange: (event: string, data: Record<string, unknown>) => void;
}

@Injectable()
export class ToolsService {
  private stateCallback: ToolStateCallback | null = null;

  setStateCallback(callback: ToolStateCallback | null) {
    this.stateCallback = callback;
  }

  private emitState(event: string, data: Record<string, unknown>) {
    if (this.stateCallback) {
      this.stateCallback.onStateChange(event, data);
    }
  }

  /**
   * Web search tool for external data
   */
  websiteSearchTool(): Tool {
    return tool({
      description:
        'Useful for when you need to answer questions about current events or find specific information from the web.',
      inputSchema: z.object({
        query: z.string().describe('Be specific about what you want to search'),
      }),
      execute: async ({ query }) => {
        try {
          this.emitState('web_search_started', { query });

          const { text } = await generateText({
            model: google('gemini-2.0-flash'),
            prompt: query,
            system: getSearchAgentPrompt(),
          });

          this.emitState('web_search_completed', { query, data: text });

          return {
            success: true,
            data: text,
          };
        } catch (error) {
          this.emitState('web_search_error', { query, error: error.message });
          return {
            success: false,
            error: error.message,
          };
        }
      },
    });
  }

  getTools() {
    return {
      web_search: this.websiteSearchTool(),
    };
  }
}
