import { fetch } from 'undici';
const VALID_COMMENT_TYPES = ['bug', 'scope-drift', 'reuse', 'security', 'question', 'suggestion', 'style'];
function extractTextFromResponse(body) {
    if (!body) {
        return '';
    }
    if (typeof body === 'string') {
        return body;
    }
    const choice = Array.isArray(body.choices) ? body.choices[0] : null;
    if (choice) {
        if (typeof choice.text === 'string') {
            return choice.text;
        }
        if (choice.message && typeof choice.message.content === 'string') {
            return choice.message.content;
        }
        if (typeof choice.delta?.content === 'string') {
            return choice.delta.content;
        }
    }
    if (typeof body.output === 'string') {
        return body.output;
    }
    if (Array.isArray(body.outputs) && typeof body.outputs[0]?.content === 'string') {
        return body.outputs[0].content;
    }
    return JSON.stringify(body);
}
function normalizeReviewResponse(value) {
    if (!value || typeof value !== 'object') {
        return {
            summary: {
                overview: '',
                reuseNotes: [],
                actionItems: [],
            },
            comments: [],
            separatePrSuggestions: [],
        };
    }
    const parsed = value;
    const summarySource = parsed.summary ?? parsed.review ?? '';
    const summary = typeof summarySource === 'string'
        ? {
            overview: summarySource.trim(),
            reuseNotes: [],
            actionItems: [],
        }
        : {
            verdict: typeof summarySource?.verdict === 'string'
                ? summarySource.verdict.trim()
                : undefined,
            primaryGoal: typeof summarySource?.primaryGoal === 'string'
                ? summarySource.primaryGoal.trim()
                : undefined,
            overview: typeof summarySource?.overview === 'string'
                ? summarySource.overview.trim()
                : undefined,
            scopeAssessment: typeof summarySource?.scopeAssessment === 'string'
                ? summarySource.scopeAssessment.trim()
                : undefined,
            riskAssessment: typeof summarySource?.riskAssessment === 'string'
                ? summarySource.riskAssessment.trim()
                : undefined,
            reuseNotes: Array.isArray(summarySource?.reuseNotes)
                ? summarySource.reuseNotes.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
                : [],
            actionItems: Array.isArray(summarySource?.actionItems)
                ? summarySource.actionItems.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
                : [],
        };
    const comments = Array.isArray(parsed.comments)
        ? parsed.comments
            .filter((item) => Boolean(item) && typeof item === 'object')
            .map((item) => ({
            path: typeof item.path === 'string' ? item.path : '',
            line: typeof item.line === 'number' && item.line > 0 ? item.line : 1,
            body: typeof item.body === 'string' ? item.body.trim() : '',
            type: typeof item.type === 'string' && VALID_COMMENT_TYPES.includes(item.type)
                ? item.type
                : undefined,
            suggestion: typeof item.suggestion === 'string' ? item.suggestion.trim() : undefined,
        }))
            .filter((item) => item.path && item.body)
        : [];
    const separatePrSuggestions = Array.isArray(parsed.separate_pr_suggestions)
        ? parsed.separate_pr_suggestions.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
        : [];
    return { summary, comments, separatePrSuggestions };
}
function parseReviewResponse(raw) {
    const text = raw.trim();
    try {
        return normalizeReviewResponse(JSON.parse(text));
    }
    catch {
        const first = text.indexOf('{');
        const last = text.lastIndexOf('}');
        if (first >= 0 && last > first) {
            try {
                return normalizeReviewResponse(JSON.parse(text.slice(first, last + 1)));
            }
            catch {
            }
        }
        // Attempt to extract common string fields from JSON-like text (best-effort)
        function extractStringField(objText, key) {
            const keyIndex = objText.indexOf(`\"${key}\"`);
            if (keyIndex < 0)
                return null;
            let i = keyIndex + key.length + 2; // position after "key"
            // find ':'
            const colon = objText.indexOf(':', i);
            if (colon < 0)
                return null;
            i = colon + 1;
            // skip whitespace
            while (i < objText.length && /\s/.test(objText[i]))
                i++;
            if (i >= objText.length)
                return null;
            const quote = objText[i];
            if (quote !== '"' && quote !== "'")
                return null;
            i++;
            let result = '';
            let escaped = false;
            for (; i < objText.length; i++) {
                const ch = objText[i];
                if (escaped) {
                    result += ch;
                    escaped = false;
                    continue;
                }
                if (ch === '\\') {
                    escaped = true;
                    result += ch; // keep the backslash for JSON.parse later
                    continue;
                }
                if (ch === quote) {
                    // try to JSON.parse the extracted string to unescape sequences
                    try {
                        const parsed = JSON.parse(quote + result + quote);
                        return String(parsed);
                    }
                    catch {
                        return result;
                    }
                }
                result += ch;
            }
            return null;
        }
        const extractedOverview = extractStringField(text, 'overview') ?? extractStringField(text, 'summary');
        const extractedVerdict = extractStringField(text, 'verdict');
        const extractedPrimary = extractStringField(text, 'primaryGoal') ?? extractStringField(text, 'primary_goal');
        const summary = {
            overview: extractedOverview ?? text,
            reuseNotes: [],
            actionItems: [],
        };
        if (extractedVerdict)
            summary.verdict = extractedVerdict;
        if (extractedPrimary)
            summary.primaryGoal = extractedPrimary;
        return {
            summary,
            comments: [],
            separatePrSuggestions: [],
        };
    }
}
function describeFetchError(error) {
    if (!(error instanceof Error)) {
        return String(error);
    }
    const details = [error.message];
    const errorWithCause = error;
    if (errorWithCause.code) {
        details.push(`code=${errorWithCause.code}`);
    }
    if (errorWithCause.cause && typeof errorWithCause.cause === 'object') {
        const cause = errorWithCause.cause;
        if (cause.message) {
            details.push(`cause=${cause.message}`);
        }
        if (cause.code) {
            details.push(`causeCode=${cause.code}`);
        }
    }
    return details.join(', ');
}
export class GroqClient {
    apiKey;
    apiUrl;
    model;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.apiUrl = config.apiUrl.replace(/\/$/, '');
        this.model = config.model;
    }
    buildEndpoints() {
        const base = this.apiUrl;
        if (base.endsWith('/v1')) {
            return [`${base}/chat/completions`];
        }
        return [`${base}/v1/chat/completions`, `${base}/chat/completions`];
    }
    buildRequestBody(prompt) {
        return {
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert code reviewer. Return only valid JSON matching the requested review schema. Do not include any extra prose outside the JSON object.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 1,
            max_completion_tokens: 8192,
            top_p: 1,
            reasoning_effort: 'medium',
            stream: false,
        };
    }
    async complete(prompt) {
        const endpoints = this.buildEndpoints();
        const body = JSON.stringify(this.buildRequestBody(prompt));
        const failures = [];
        for (const url of endpoints) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body,
                });
                if (!response.ok) {
                    const responseText = await response.text();
                    throw new Error(`LLM API error ${response.status} from ${url}: ${responseText}`);
                }
                const responseBody = await response.json();
                const text = extractTextFromResponse(responseBody);
                return parseReviewResponse(text);
            }
            catch (error) {
                failures.push(`request to ${url} failed: ${describeFetchError(error)}`);
            }
        }
        throw new Error(`LLM request failed for all endpoints. Errors: ${failures.join(' | ') || 'unknown error'}`);
    }
}
