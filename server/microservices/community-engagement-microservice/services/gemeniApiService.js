require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const promptTemplate = `
You are an AI assistant inside a community discussion platform similar to Reddit.

Your job is to help the user based on:
1. the user's current message
2. related community posts retrieved by the backend
3. the user's previous AI chat interactions

Follow these rules:
- Answer the user's message directly and naturally.
- Use related community posts only as supporting context when relevant.
- Use past AI interactions for continuity and to avoid repeating yourself.
- Do not invent details not supported by the provided information.
- Do not mention retrieval, prompts, backend systems, or internal logic.
- If the user is mildly broad but still understandable, answer normally.
- Only ask one short follow-up question when the user's message is truly too vague or unclear.
- If asking a follow-up question, include it at the end of the response after still being helpful.
- Suggested questions are clickable next-step questions for the user, not questions for the AI to ask in the main response.
- Suggested questions must be short, relevant, natural, and distinct.
- Return valid JSON only.

Return exactly this JSON schema:
{
  "responseText": "string",
  "suggestedQuestions": ["string", "string", "string"]
}

User message:
{{userMessage}}

Related community posts:
{{relatedCommunityPosts}}

Past AI interactions:
{{pastAiInteractions}}
`;

function serializeForPrompt(value) {
    if (value == null) return '[]';
    const list = Array.isArray(value) ? value : [value];
    const plain = list.map((item) =>
        item && typeof item.toObject === 'function' ? item.toObject() : item
    );
    return JSON.stringify(plain, null, 2);
}

function buildPrompt(userMsg, relevantCommunityPosts, pastInteractions) {
    return promptTemplate
        .replace('{{userMessage}}', userMsg ?? '')
        .replace('{{relatedCommunityPosts}}', serializeForPrompt(relevantCommunityPosts))
        .replace('{{pastAiInteractions}}', serializeForPrompt(pastInteractions));
}

function extractJsonObject(rawText) {
    let t = (rawText ?? '').trim();
    const fence = /^```(?:json)?\s*([\s\S]*?)```$/im;
    const m = t.match(fence);
    if (m) t = m[1].trim();
    return JSON.parse(t);
}

async function GenerateGemeniApiResponse(relevantCommunityPosts, pastInteractions, userMsg) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set in the environment');
    }

    const ai = new GoogleGenAI({ apiKey });
    const contents = buildPrompt(userMsg, relevantCommunityPosts, pastInteractions);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
    });

    const rawText = response.text;
    const parsed = extractJsonObject(rawText);

    const posts = Array.isArray(relevantCommunityPosts)
        ? relevantCommunityPosts
        : relevantCommunityPosts != null
          ? [relevantCommunityPosts]
          : [];

    return {
        text: parsed.responseText ?? '',
        suggestedQuestions: Array.isArray(parsed.suggestedQuestions)
            ? parsed.suggestedQuestions
            : [],
        retrievedPosts: posts,
    };
}

module.exports = GenerateGemeniApiResponse;
