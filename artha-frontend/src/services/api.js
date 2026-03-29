import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
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
