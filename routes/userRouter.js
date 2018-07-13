// dependencies
const express = require('express');

// controller
const { register, login, profile } = require('../controllers/userController');

// middlewares
const { middleware } = require('../utils/token');

// statics
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', middleware, profile);

module.exports = router;
