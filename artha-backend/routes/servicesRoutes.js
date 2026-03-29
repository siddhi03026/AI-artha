const express = require('express');
const { getMarketplaceServices, trackServiceInteraction } = require('../controllers/servicesController');

const router = express.Router();

router.get('/', getMarketplaceServices);
router.post('/interact', trackServiceInteraction);

module.exports = router;
