import * as core from '@actions/core';
import * as github from '@actions/github';
import { runReview } from './reviewer.js';
function getInputValue(name, fallback = '', envName) {
    const input = core.getInput(name);
    if (input.length) {
        return input;
    }
    if (envName && process.env[envName]) {
        return process.env[envName] ?? '';
    }
    return fallback;
}
function parseBoolean(value) {
    return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}
function normalizeReviewLens(value) {
    const normalized = value.trim().toLowerCase();
    if (['default', 'security', 'socratic', 'performance', 'scope-guard'].includes(normalized)) {
        return normalized;
    }
    return 'default';
}
async function run() {
    const githubToken = getInputValue('github_token', process.env.GITHUB_TOKEN ?? '', 'GITHUB_TOKEN');
    const llmProvider = (getInputValue('llm_provider', process.env.LLM_PROVIDER ?? 'openrouter', 'LLM_PROVIDER') ?? 'openrouter');
    const llmApiUrl = getInputValue('llm_api_url', process.env.LLM_API_URL ?? 'https://openrouter.ai/api/v1', 'LLM_API_URL') ?? 'https://openrouter.ai/api/v1';
    const llmApiKey = getInputValue('llm_api_key', process.env.LLM_API_KEY ?? '', 'LLM_API_KEY');
    const llmModel = getInputValue('llm_model', process.env.LLM_MODEL ?? 'openrouter/free', 'LLM_MODEL') ?? 'openrouter/free';
    const reviewMode = (getInputValue('review_mode', process.env.REVIEW_MODE ?? 'both', 'REVIEW_MODE') ?? 'both');
    const toneMode = (getInputValue('tone_mode', process.env.TONE_MODE ?? 'balanced', 'TONE_MODE') ?? 'balanced');
    const reviewLens = normalizeReviewLens(getInputValue('review_lens', process.env.REVIEW_LENS ?? 'default', 'REVIEW_LENS') ?? 'default');
    const debiasedMode = parseBoolean(getInputValue('debiased_mode', process.env.DEBIASED_MODE ?? 'false', 'DEBIASED_MODE') ?? 'false');
    const repository = github.context.repo;
    const pullRequestNumber = github.context.payload.pull_request?.number;
    if (!llmApiKey) {
        core.setFailed('LLM API key is required through llm_api_key input or LLM_API_KEY env var.');
        return;
    }
    if (!pullRequestNumber) {
        core.setFailed('Pull request number is required from the GitHub event context.');
        return;
    }
    await runReview({
        owner: repository.owner,
        repo: repository.repo,
        pullNumber: pullRequestNumber,
        githubToken,
        llmProvider: llmProvider,
        llmApiUrl,
        llmApiKey,
        llmModel,
        reviewMode: reviewMode,
        toneMode,
        reviewLens,
        debiasedMode,
    });
}
run().catch((error) => core.setFailed(`${error}`));
