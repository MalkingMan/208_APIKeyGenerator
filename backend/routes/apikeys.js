 
const express = require('express');
const router = express.Router();
const { createApiKey, getAllApiKeys } = require('../controllers/apiKeyController');

router.post('/', createApiKey);
router.get('/', getAllApiKeys);

module.exports = router;

