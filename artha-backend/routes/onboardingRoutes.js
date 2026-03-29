const express = require('express');
const { saveOnboarding } = require('../controllers/onboardingController');

const router = express.Router();

router.post('/', saveOnboarding);

module.exports = router;
