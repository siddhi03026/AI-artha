const Chat = require('../models/Chat');
const User = require('../models/User');
const { getChatCompletion } = require('../services/aiAgentService');

const DEFAULT_USER_ID = 'demo-user-123';

const getAIErrorDetails = (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const message = error?.message || 'Unknown AI error';

  return {
    status,
    message,
    data,
  };
};

const generateAssistantReply = (message) => {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('50-30-20') ||
    lowerMessage.includes('50/30/20') ||
    (lowerMessage.includes('50') && lowerMessage.includes('30') && lowerMessage.includes('20'))
  ) {
    return 'The 50-30-20 rule means: 50% of income for needs (rent, food, bills), 30% for wants (shopping, outings), and 20% for savings or debt repayment. If your expenses are tight, start with 60-25-15 and move toward 50-30-20 gradually.';
  }

  if (lowerMessage.includes('save')) {
    return 'Great intent. A practical start is the 50/30/20 rule: 50% needs, 30% wants, and 20% savings or debt repayment.';
  }

  if (lowerMessage.includes('invest')) {
    return 'Start with a monthly SIP in diversified index funds, then increase allocation as your emergency fund reaches 6 months.';
  }

  if (lowerMessage.includes('debt') || lowerMessage.includes('loan')) {
    return 'Prioritize high-interest debt first using an avalanche strategy, while continuing minimum payments on all other loans.';
  }

  return 'You are doing well by asking early. Keep spending mindful, automate savings, and review your goals monthly for steady progress.';
};

const chatWithConcierge = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const user = await User.findOneAndUpdate(
      { userId: DEFAULT_USER_ID },
      { userId: DEFAULT_USER_ID },
      { upsert: true, new: true }
    );

    const existingChat = await Chat.findOne({ userId: DEFAULT_USER_ID }).lean();
    let assistantResponse;
    let source = 'fallback';

    try {
      assistantResponse = await getChatCompletion({
        message,
        history: existingChat?.messages || [],
        userProfile: user,
      });
      source = 'ai';
    } catch (aiError) {
      console.error('AI provider failed, using fallback:', getAIErrorDetails(aiError));
      assistantResponse = generateAssistantReply(message);
    }

    const chat = await Chat.findOneAndUpdate(
      { userId: DEFAULT_USER_ID },
      {
        $push: {
          messages: [
            { role: 'user', content: message },
            { role: 'assistant', content: assistantResponse },
          ],
        },
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      response: assistantResponse,
      source,
      chat,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to process chat',
      error: error.message,
    });
  }
};

const getChatHistory = async (_req, res) => {
  try {
    const chat = await Chat.findOne({ userId: DEFAULT_USER_ID }).lean();

    if (!chat || !Array.isArray(chat.messages) || chat.messages.length === 0) {
      return res.status(200).json({
        sessions: [],
      });
    }

    const sessions = [];
    for (let index = 0; index < chat.messages.length; index += 1) {
      const current = chat.messages[index];
      const next = chat.messages[index + 1];

      if (current?.role !== 'user') continue;

      sessions.push({
        id: `${index}-${current.timestamp || Date.now()}`,
        userMessage: current.content,
        assistantMessage: next?.role === 'assistant' ? next.content : '',
        createdAt: current.timestamp || chat.updatedAt,
      });
    }

    return res.status(200).json({
      sessions: sessions.slice(-20).reverse(),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch chat history',
      error: error.message,
    });
  }
};

const deleteChatHistorySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId is required' });
    }

    const indexToken = String(sessionId).split('-')[0];
    const messageIndex = Number.parseInt(indexToken, 10);

    if (Number.isNaN(messageIndex) || messageIndex < 0) {
      return res.status(400).json({ message: 'Invalid sessionId' });
    }

    const chat = await Chat.findOne({ userId: DEFAULT_USER_ID });

    if (!chat || !Array.isArray(chat.messages) || chat.messages.length === 0) {
      return res.status(404).json({ message: 'Chat history not found' });
    }

    if (!chat.messages[messageIndex] || chat.messages[messageIndex].role !== 'user') {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    let deleteCount = 1;
    if (chat.messages[messageIndex + 1] && chat.messages[messageIndex + 1].role === 'assistant') {
      deleteCount = 2;
    }

    chat.messages.splice(messageIndex, deleteCount);
    await chat.save();

    return res.status(200).json({
      message: 'Chat session deleted',
      sessionId,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete chat session',
      error: error.message,
    });
  }
};

module.exports = {
  chatWithConcierge,
  getChatHistory,
  deleteChatHistorySession,
};
