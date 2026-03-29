import axios from 'axios';

const DEFAULT_PROD_API_URL = 'https://ai-artha-dj4r.onrender.com';

const getDefaultBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }

  return DEFAULT_PROD_API_URL;
};

const rawBaseUrl = import.meta.env.VITE_API_URL || getDefaultBaseUrl();
const cleanedBaseUrl = String(rawBaseUrl).trim();
const extractedHttpUrl = cleanedBaseUrl.match(/https?:\/\/[^\s]+/i)?.[0] || cleanedBaseUrl;
const normalizedBaseUrl = extractedHttpUrl.replace(/\/+$/, '');
const apiBaseUrl = normalizedBaseUrl.endsWith('/api')
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20000,
});

export const submitOnboarding = (payload) => api.post('/onboarding', payload);
export const sendChatMessage = (payload) => api.post('/chat', payload);
export const fetchChatHistory = () => api.get('/chat/history');
export const deleteChatHistorySession = (sessionId) => api.delete(`/chat/history/${encodeURIComponent(sessionId)}`);
export const fetchDashboard = () => api.get('/dashboard');
export const fetchServices = () => api.get('/services');
export const trackServiceInteraction = (payload) => api.post('/services/interact', payload);
export const runSimulation = (payload) => api.post('/simulation', payload);
export const fetchPersonality = () => api.get('/personality');
export const fetchAIActionPlan = () => api.get('/ai-plan');

export default api;
