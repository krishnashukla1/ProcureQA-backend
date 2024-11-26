const express = require('express');
const router = express.Router();
const { addClientHistory, getClientHistory } = require('../controllers/clientHistoryController');

// Route to add a new client history entry
router.post('/add', addClientHistory);

// Route to get client history by clientId
router.get('/:clientId', getClientHistory);

module.exports = router;
