const express = require('express');
const home = require('./home');
const users = require('./users');
const expense = require('./expense');
const tag = require('./tag');

const isAuthenticated = require('../middlewares/authMiddleware');


const router = express.Router();

router.use('/', home);
router.use('/', users);
router.use('/users',isAuthenticated, users);
router.use('/expenses/tags', isAuthenticated, tag);
router.use('/expenses',isAuthenticated, expense);

module.exports = router;
