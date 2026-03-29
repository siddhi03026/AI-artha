const express = require('express');
const { getAIActionPlan } = require('../controllers/aiPlanController');

const router = express.Router();

router.get('/', getAIActionPlan);

module.exports = router;
