const axios = require('axios');

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4o-mini';
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const GROQ_DEFAULT_MODEL = 'llama-3.1-8b-instant';

const isGroqKey = (apiKey = '') => apiKey.startsWith('gsk_');

const getClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  const fallbackBaseUrl = isGroqKey(apiKey) ? GROQ_BASE_URL : DEFAULT_BASE_URL;
  const baseURL = process.env.OPENAI_BASE_URL || fallbackBaseUrl;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  return axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
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
  const client = getClient();
  const apiKey = process.env.OPENAI_API_KEY || '';
  const defaultModel = isGroqKey(apiKey) ? GROQ_DEFAULT_MODEL : DEFAULT_MODEL;
  const model = process.env.OPENAI_MODEL || defaultModel;

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

  const response = await client.post('/chat/completions', payload);
  const content = response.data?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('Empty AI response');
  }

  return content;
};

module.exports = {
  getChatCompletion,
};
