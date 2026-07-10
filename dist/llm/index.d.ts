import type { LLMConfig, LLMProvider, ReviewResponse } from '../types.js';
export interface LLMClient {
    complete(prompt: string): Promise<ReviewResponse>;
}
export declare function createLLMClient(provider: LLMProvider, config: LLMConfig): LLMClient;
