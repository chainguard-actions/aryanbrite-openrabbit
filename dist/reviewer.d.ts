import type { ReviewContext, ReviewResponse, ToneMode } from './types.js';
interface ChangedFile {
    path: string;
    patch: string | null;
}
interface LinkedIssue {
    number: number;
    title: string;
    body: string | null;
    state: string;
}
interface PromptOptions {
    title: string;
    body: string | null;
    linkedIssues?: LinkedIssue[];
    repositoryFiles?: string[];
    changedFiles: ChangedFile[];
    skippedFiles?: string[];
    reviewMode?: import('./types.js').ReviewMode;
    toneMode?: ToneMode;
    additionalFiles?: Array<{
        path: string;
        content: string;
    }>;
    specialInstructions?: string;
    reviewLensInstructions?: string;
    languageLenses?: string[];
    multiPassContext?: string;
    priorSummaries?: string;
    metadataNote?: string;
    includePatches?: boolean;
}
export declare function buildReviewPrompt({ title, body, linkedIssues, repositoryFiles, changedFiles, skippedFiles, reviewMode, toneMode, additionalFiles, specialInstructions, reviewLensInstructions, languageLenses, multiPassContext, priorSummaries, metadataNote, includePatches, }: PromptOptions): string;
export declare function parseReviewResponse(text: string): ReviewResponse;
export declare function runReview(context: ReviewContext): Promise<void>;
export {};
