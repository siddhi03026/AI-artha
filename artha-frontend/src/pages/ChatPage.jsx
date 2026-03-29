import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SendHorizonal,
  BriefcaseBusiness,
  UserRound,
  Sparkles,
  History,
  ChevronDown,
  ChevronUp,
  Plus,
  MessageSquareText,
  Search,
  Trash2,
} from 'lucide-react';
import TypingText from '../components/TypingText';
import { deleteChatHistorySession, fetchChatHistory, sendChatMessage } from '../services/api';

const introMessage = {
  role: 'assistant',
  content:
    "Hey there! 👋 I'm Artha, your personal money companion. I'm here to help you make sense of your finances - no jargon, no judgment. What would you like to explore today?",
};

function ChatPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('fallback');
  const [history, setHistory] = useState([]);
  const [historyOpenMobile, setHistoryOpenMobile] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([introMessage]);

  const prompts = [
    "How should I start saving?",
    "What's the 50-30-20 rule?",
    'Help me set a financial goal',
    'How much should I invest monthly?',
  ];

  const quickActions = [
    { label: 'New chat', icon: Plus, onClick: () => startNewChat() },
    { label: 'Search chats', icon: Search, onClick: () => setHistoryOpenMobile(true) },
  ];

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setSelectedHistoryId(null);
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await sendChatMessage({ message: userMessage });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      setSource(data.source || 'fallback');
      const historyResponse = await fetchChatHistory();
      setHistory(historyResponse.data?.sessions || []);
    } catch (_error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I could not reach the financial concierge service right now. Please try once more.',
        },
      ]);
      setSource('fallback');
    } finally {
      setLoading(false);
    }
  };

  const formatHistoryTitle = (text = '') => {
    if (!text) return 'Untitled chat';
    return text.length > 42 ? `${text.slice(0, 42)}...` : text;
  };

  const formatHistoryTime = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const startNewChat = () => {
    setSelectedHistoryId(null);
    setMessages([introMessage]);
    setInput('');
  };

  const handleHistorySelect = (item) => {
    const restored = [introMessage, { role: 'user', content: item.userMessage }];
    if (item.assistantMessage) {
      restored.push({ role: 'assistant', content: item.assistantMessage });
    }

    setMessages(restored);
    setSelectedHistoryId(item.id);
    setHistoryOpenMobile(false);
  };

  const handleDeleteHistory = async (event, item) => {
    event.stopPropagation();

    try {
      await deleteChatHistorySession(item.id);
      const { data } = await fetchChatHistory();
      const updated = data?.sessions || [];
      setHistory(updated);

      if (selectedHistoryId === item.id) {
        startNewChat();
      }
    } catch (_error) {
      // Keep UI stable if delete fails.
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await fetchChatHistory();
        setHistory(data?.sessions || []);
      } catch (_error) {
        setHistory([]);
      }
    };

    loadHistory();
  }, []);

  return (
    <main className="mx-auto w-full max-w-[1540px] px-3 py-4 sm:px-6 sm:py-7">
      <section className="rounded-2xl border border-slate-200 bg-[#f5f7fb] px-3 pb-3 pt-4 sm:px-8 sm:pb-5 sm:pt-6">
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-semibold text-violet-500">
            <Sparkles size={14} />
            AI Financial Concierge
          </span>
        </div>

        <div className="mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setHistoryOpenMobile((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
          >
            <History size={15} />
            Chat History
            {historyOpenMobile ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {historyOpenMobile ? (
            <div className="mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-[#f7f7f8] p-2">
              <div className="mb-2 space-y-1.5">
                {quickActions.slice(0, 2).map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={action.onClick}
                      className="inline-flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      <ActionIcon size={14} />
                      {action.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5">
                {history.length ? (
                  history.map((item) => (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleHistorySelect(item)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleHistorySelect(item);
                        }
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-xs transition ${
                        selectedHistoryId === item.id
                          ? 'border border-violet-200 bg-white text-slate-800 shadow-sm'
                          : 'border border-transparent text-slate-600 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-medium">{formatHistoryTitle(item.userMessage)}</p>
                        <button
                          type="button"
                          onClick={(event) => handleDeleteHistory(event, item)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-500"
                          aria-label="Delete chat"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <p className="mt-1 line-clamp-1 text-[11px] text-slate-500">{item.assistantMessage}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">{formatHistoryTime(item.createdAt)}</p>
                    </div>
                  ))
                ) : (
                  <p className="px-2 py-3 text-sm text-slate-500">No chat history yet.</p>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[290px,1fr]">
          <aside className="hidden h-[640px] overflow-y-auto rounded-2xl border border-slate-200 bg-[#f7f7f8] p-3 lg:block">
            <div className="mb-3 rounded-xl border border-slate-200 bg-white p-2">
              <div className="space-y-1">
                {quickActions.map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={action.onClick}
                      className="inline-flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <ActionIcon size={14} className="text-slate-500" />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Your chats</p>
            <div className="space-y-1.5">
              {history.length ? (
                history.map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleHistorySelect(item)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleHistorySelect(item);
                      }
                    }}
                    className={`w-full rounded-xl px-3 py-2 text-left transition ${
                      selectedHistoryId === item.id
                        ? 'border border-violet-200 bg-white shadow-sm'
                        : 'border border-transparent hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="flex items-center gap-2 truncate text-sm font-medium text-slate-800">
                        <MessageSquareText size={14} className="shrink-0 text-slate-400" />
                        <span className="truncate">{formatHistoryTitle(item.userMessage)}</span>
                      </p>
                      <button
                        type="button"
                        onClick={(event) => handleDeleteHistory(event, item)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-500"
                        aria-label="Delete chat"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.assistantMessage}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">{formatHistoryTime(item.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="px-2 py-3 text-sm text-slate-500">No chat history yet.</p>
              )}
            </div>
          </aside>

          <div className="flex h-[calc(100vh-180px)] min-h-[520px] flex-col rounded-2xl border border-slate-200 bg-[#f9fbff] p-3 sm:p-4 lg:h-[640px]">
            <div className="mb-3 border-b border-slate-200 pb-2">
              <p className="text-sm font-semibold text-slate-700">
                {selectedHistoryId ? 'Selected conversation' : 'New chat'}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {selectedHistoryId ? 'Continue from history or ask a new follow-up.' : 'Start a new financial conversation with Artha AI.'}
              </p>
            </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1 pb-3">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/90 text-white">
                <BriefcaseBusiness size={14} />
              </span>
              <div className="max-w-[88%] rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-800 shadow-sm sm:max-w-[74%] sm:px-4 sm:py-3 sm:text-base">
                {messages[0].content}
              </div>
            </div>

            <AnimatePresence>
              {messages.slice(1).map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-start gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'assistant' ? (
                    <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-violet-500/90 text-white sm:h-8 sm:w-8">
                      <BriefcaseBusiness size={14} />
                    </span>
                  ) : null}

                  <div
                    className={`max-w-[88%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed shadow-sm sm:max-w-[74%] sm:px-4 sm:py-3 sm:text-base ${
                      message.role === 'assistant'
                        ? 'border border-slate-200 bg-white text-slate-800'
                        : 'bg-violet-600 text-white'
                    }`}
                  >
                    {message.role === 'assistant' && index === messages.length - 2 ? (
                      <TypingText text={message.content} speed={10} />
                    ) : (
                      message.content
                    )}
                  </div>

                  {message.role === 'user' ? (
                    <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-slate-500 sm:h-8 sm:w-8">
                      <UserRound size={14} />
                    </span>
                  ) : null}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:300ms]" />
                <span className="ml-1">Artha AI is thinking...</span>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          <div className="sticky bottom-0 border-t border-slate-200/90 bg-[#f5f7fb] pt-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:py-2 sm:text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2 pb-1">
              <input
                type="text"
                placeholder="Ask me anything about money..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="neon-input h-11 w-full rounded-2xl px-3 text-sm outline-none transition sm:h-12 sm:px-4 sm:text-base"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500 text-white transition hover:bg-violet-600 disabled:opacity-60 sm:h-12 sm:w-12"
                aria-label="Send message"
              >
                <SendHorizonal size={17} />
              </button>
            </form>

            <p className="mt-2 text-xs text-slate-400">Mode: {source}</p>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ChatPage;
