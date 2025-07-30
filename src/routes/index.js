const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
//const studentRoutes = require('./user');

router.use('/auth', authRoutes); // /api/auth
//router.use('/users', studentRoutes); // /api/users

module.exports = router;