const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

router.post('/', agentController.createAgent);
router.get('/', agentController.getAgents);
router.get('/:id', agentController.getAgentById);

module.exports = router;
