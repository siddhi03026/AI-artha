const axios = require('axios');

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4o-mini';
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const GROQ_DEFAULT_MODEL = 'llama-3.1-8b-instant';

const isGroqKey = (apiKey = '') => apiKey.startsWith('gsk_');
const normalizeEnvValue = (value = '') => String(value).trim().replace(/^['\"]|['\"]$/g, '');

const getCompletionsUrl = () => {
  const apiKey = normalizeEnvValue(process.env.OPENAI_API_KEY || '');
  const fallbackBaseUrl = isGroqKey(apiKey) ? GROQ_BASE_URL : DEFAULT_BASE_URL;
  const rawBaseUrl = normalizeEnvValue(process.env.OPENAI_BASE_URL || fallbackBaseUrl);
  const baseURL = rawBaseUrl.replace(/\/+$/, '');

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  if (baseURL.endsWith('/chat/completions')) {
    return baseURL;
  }

  if (baseURL.endsWith('/v1') || baseURL.endsWith('/openai/v1')) {
    return `${baseURL}/chat/completions`;
  }

  // Allow users to set OPENAI_BASE_URL as provider root (e.g. https://api.groq.com)
  if (isGroqKey(apiKey)) {
    return `${baseURL}/openai/v1/chat/completions`;
  }

  return `${baseURL}/v1/chat/completions`;
};

const buildSystemPrompt = (userProfile = {}) => {
  const income = userProfile.income || 0;
  const riskLevel = userProfile.riskLevel || 'medium';
  const goals = Array.isArray(userProfile.goals) ? userProfile.goals.join(', ') : '';

  return [
    'You are Artha AI, a calm and beginner-friendly financial concierge.',
    'Give practical personal finance guidance in simple language.',
    'Avoid legal/tax certainty claims and suggest users verify with licensed advisors for critical decisions.',
    `User context: income=${income}, riskLevel=${riskLevel}, goals=${goals || 'not provided'}.`,
  ].join(' ');
};

const getChatCompletion = async ({ message, history = [], userProfile = {} }) => {
  const apiKey = normalizeEnvValue(process.env.OPENAI_API_KEY || '');
  const completionsUrl = getCompletionsUrl();
  const defaultModel = isGroqKey(apiKey) ? GROQ_DEFAULT_MODEL : DEFAULT_MODEL;
  const model = normalizeEnvValue(process.env.OPENAI_MODEL || defaultModel);

  const formattedHistory = history.slice(-8).map((item) => ({
    role: item.role,
    content: item.content,
  }));

  const payload = {
    model,
    temperature: 0.4,
    messages: [
      { role: 'system', content: buildSystemPrompt(userProfile) },
      ...formattedHistory,
      { role: 'user', content: message },
    ],
  };

  const response = await axios.post(completionsUrl, payload, {
    timeout: 15000,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  const content = response.data?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('Empty AI response');
  }

  return content;
};

module.exports = {
  getChatCompletion,
};
