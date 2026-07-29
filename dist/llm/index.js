import { GroqClient } from './groq.js';
export function createLLMClient(provider, config) {
    if (provider === 'groq' || provider === 'openrouter') {
        return new GroqClient(config);
    }
    throw new Error(`Unsupported provider ${provider}`);
}
