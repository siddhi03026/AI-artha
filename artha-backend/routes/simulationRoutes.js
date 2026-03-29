const express = require('express');
const { runFutureSimulation } = require('../controllers/simulationController');

const router = express.Router();

router.post('/', runFutureSimulation);

module.exports = router;
