const express = require('express');
const { chatWithConcierge, getChatHistory, deleteChatHistorySession } = require('../controllers/chatController');

const router = express.Router();

router.post('/', chatWithConcierge);
router.get('/history', getChatHistory);
router.delete('/history/:sessionId', deleteChatHistorySession);

module.exports = router;
