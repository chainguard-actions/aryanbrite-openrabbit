import type { LLMClient } from './index.js';
import type { LLMConfig, ReviewResponse } from '../types.js';
export declare class GroqClient implements LLMClient {
    readonly apiKey: string;
    readonly apiUrl: string;
    readonly model: string;
    constructor(config: LLMConfig);
    private buildEndpoints;
    private buildRequestBody;
    complete(prompt: string): Promise<ReviewResponse>;
}
