import { runReview } from './reviewer.js';
function getArg(name) {
    const prefix = `--${name}=`;
    const arg = process.argv.find((value) => value.startsWith(prefix));
    return arg?.slice(prefix.length);
}
function getValue(name, envName, fallback) {
    return getArg(name) ?? process.env[envName] ?? fallback ?? '';
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
async function main() {
    const owner = getValue('owner', 'GITHUB_OWNER');
    const repo = getValue('repo', 'GITHUB_REPO');
    const pullNumber = Number(getValue('pull-number', 'GITHUB_PULL_NUMBER'));
    const githubToken = getValue('github-token', 'GITHUB_TOKEN');
    const llmProvider = getValue('llm-provider', 'LLM_PROVIDER', 'openrouter');
    const llmApiUrl = getValue('llm-api-url', 'LLM_API_URL', 'https://openrouter.ai/api/v1');
    const llmApiKey = getValue('llm-api-key', 'LLM_API_KEY');
    const llmModel = getValue('llm-model', 'LLM_MODEL', 'openrouter/free');
    const reviewMode = getValue('review-mode', 'REVIEW_MODE', 'both');
    const toneMode = getValue('tone-mode', 'TONE_MODE', 'balanced');
    const reviewLens = normalizeReviewLens(getValue('review-lens', 'REVIEW_LENS', 'default'));
    const debiasedMode = parseBoolean(getValue('debiased-mode', 'DEBIASED_MODE', 'false'));
    if (!owner || !repo || !pullNumber || !githubToken || !llmApiKey) {
        console.error('Missing required arguments. Use --owner, --repo, --pull-number, --github-token, --llm-api-key.');
        process.exit(1);
    }
    await runReview({
        owner,
        repo,
        pullNumber,
        githubToken,
        llmProvider,
        llmApiUrl,
        llmApiKey,
        llmModel,
        reviewMode,
        toneMode,
        reviewLens,
        debiasedMode,
    });
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
