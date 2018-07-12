// dependencies
const express = require('express');

// controller
const { register } = require('../controllers/userController');

// statics
const router = express.Router();

router.post('/register', register);

module.exports = router;
