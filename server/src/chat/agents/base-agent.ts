import { Tool } from 'ai';
import { RequestUser } from 'src/auth/dto/request-user.dto';

export interface AgentCapability {
  name: string;
  description: string;
  keywords: string[];
  priority: number;
}

export interface AgentContext {
  user: RequestUser;
  conversationHistory?: any[];
  currentQuery: string;
  metadata?: Record<string, unknown>;
}

export interface AgentResponse {
  agentId: string;
  agentName: string;
  content: string;
  toolCalls?: any[];
  confidence: number;
  reasoning?: string;
  suggestedFollowUps?: string[];
  metadata?: Record<string, unknown>;
}

export abstract class BaseAgent {
  protected readonly agentId: string;
  protected readonly agentName: string;
  protected readonly capabilities: AgentCapability[];
  protected readonly model: any;
  protected currentUserId: string | null = null;

  constructor(agentId: string, agentName: string, capabilities: AgentCapability[], model: any) {
    this.agentId = agentId;
    this.agentName = agentName;
    this.capabilities = capabilities;
    this.model = model;
  }

  // Abstract methods that each agent must implement
  abstract getSystemPrompt(context: AgentContext): string;
  abstract getTools(): Record<string, Tool>;
  abstract canHandle(
    query: string,
    context: AgentContext,
  ): { canHandle: boolean; confidence: number; reasoning: string };
  abstract executeQuery(query: string, context: AgentContext): Promise<AgentResponse>;

  // Shared methods
  setCurrentUser(userId: string) {
    this.currentUserId = userId;
  }

  getCurrentUser(): string | null {
    return this.currentUserId;
  }

  getCapabilities(): AgentCapability[] {
    return this.capabilities;
  }

  getAgentInfo() {
    return {
      id: this.agentId,
      name: this.agentName,
      capabilities: this.capabilities,
    };
  }

  // Helper method to check if query contains relevant keywords
  protected hasRelevantKeywords(query: string, keywords: string[]): boolean {
    const lowerQuery = query.toLowerCase();
    return keywords.some((keyword) => lowerQuery.includes(keyword.toLowerCase()));
  }

  // Helper method to calculate keyword relevance score
  protected calculateKeywordScore(query: string, keywords: string[]): number {
    const lowerQuery = query.toLowerCase();
    let score = 0;
    const totalKeywords = keywords.length;

    keywords.forEach((keyword) => {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        // Give higher score for exact matches and multiple occurrences
        const occurrences = (lowerQuery.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        score += occurrences * (keyword.length / 10); // Longer keywords get higher weight
      }
    });

    return Math.min(score / totalKeywords, 1); // Normalize to 0-1 range
  }
}
