const express = require('express');
const { chatWithConcierge, getChatHistory, deleteChatHistorySession } = require('../controllers/chatController');

const router = express.Router();

router.get('/', (_req, res) => {
	res.status(200).json({
		message: 'Chat endpoint is active. Use POST /api/chat with { message }.',
	});
});

router.post('/', chatWithConcierge);
router.get('/history', getChatHistory);
router.delete('/history/:sessionId', deleteChatHistorySession);

module.exports = router;
