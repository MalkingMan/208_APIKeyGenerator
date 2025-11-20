const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const { adminOnly } = require('../middleware/authMiddleware');
const { getAllUsers } = require('../controllers/userController');
const { getAllApiKeys } = require('../controllers/apiKeyController');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

/** Protected */
router.get('/users', adminOnly, getAllUsers);
router.get('/apikeys', adminOnly, getAllApiKeys);

module.exports = router;
 
