const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const OpenAI = require('openai');
const openai = new OpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const { COOKIE_NAME, SESSION_SECRET: SECRET } = process.env;

function getUserIdFromToken(context) {
  const token = context.req?.cookies?.[COOKIE_NAME];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded.id;
  } catch (err) {
    console.error('Error verifying token:', err);
    return null;
  }
};




async function generateAiSummary(content) {
  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      {
        role: "system",
        content: `
      You generate short, natural-sounding summaries for community posts.

      Rules:
      - Write in a neutral third-person point of view.
      - Do not write as the author.
      - Do not default to past tense.
      - Match the time context of the post: use present or future tense for upcoming events, current situations, invitations, announcements, or ongoing updates.
      - Keep the summary proportional to the original post. If the post is very short, make the summary very short too.
      - Usually write 1-2 sentences, but use only 1 short sentence if that is enough.
      - Focus only on the main point and the most important detail.
      - Do not add extra emotion, praise, or dramatic wording unless it is essential to the meaning.
      - If a name is clearly given and useful, use it naturally; otherwise say "the author" or "the post."
      - Keep the wording simple, clear, and community-friendly.

      Good style examples:
      - "Max and his wife are opening a coffee shop at Shepherd and Victoria in two weeks and are inviting neighbors to stop by."
      - "The post invites neighbors to a barbecue this weekend."
      - "The author is asking for recommendations for a local plumber."

      Return only the summary text.
      `
      },
      { role: 'user', content }
    ]
  });
  return response.choices[0].message.content;
}


module.exports = {
  getUserIdFromToken,
  generateAiSummary
};