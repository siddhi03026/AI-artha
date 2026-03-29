const express = require('express');
const { getPersonalityProfile } = require('../controllers/personalityController');

const router = express.Router();

router.get('/', getPersonalityProfile);

module.exports = router;
