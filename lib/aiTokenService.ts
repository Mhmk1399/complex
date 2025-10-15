interface TokenUsage {
  totalTokens: number;
  usedTokens: number;
  remainingTokens: number;
  lastUsed: Date;
  usageHistory: Array<{
    date: Date;
    tokensUsed: number;
    feature: string;
    prompt?: string;
  }>;
}

export class AITokenService {
  private static readonly TOKENS_PER_REQUEST = 10; // Estimated tokens per AI request
  private static readonly AI_MODAL_FEATURE = 'ai-modal-generation';

  static async getTokenUsage(storeId: string): Promise<TokenUsage | null> {
    try {
      console.log('Fetching token usage for:', storeId);
      const response = await fetch(`/api/ai-usage?storeId=${storeId}`);
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText);
        return null;
      }
      
      const data = await response.json();
      console.log('Token usage data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching token usage:', error);
      return null;
    }
  }

  static async hasEnoughTokens(storeId: string, requiredTokens: number = this.TOKENS_PER_REQUEST): Promise<boolean> {
    const usage = await this.getTokenUsage(storeId);
    return usage ? usage.remainingTokens >= requiredTokens : false;
  }

  static async consumeTokens(storeId: string, tokensUsed: number, feature: string, prompt?: string): Promise<boolean> {
    try {
      const response = await fetch('/api/ai-usage/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, tokensUsed, feature, prompt })
      });
      return response.ok;
    } catch (error) {
      console.error('Error consuming tokens:', error);
      return false;
    }
  }



  static getEstimatedTokens(): number {
    return this.TOKENS_PER_REQUEST;
  }

  static getAIModalFeature(): string {
    return this.AI_MODAL_FEATURE;
  }
}