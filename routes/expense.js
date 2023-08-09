// routes/expense.js
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/ExpenseController');
const isAuthenticated = require('../middlewares/authMiddleware');

router.get('/',isAuthenticated, expenseController.list);
router.get('/create',isAuthenticated, expenseController.create);

router.post('/',isAuthenticated, expenseController.store);
router.get('/:id/edit',isAuthenticated, expenseController.edit);
router.post('/filter',isAuthenticated, expenseController.filter);
router.get('/filterByTag/:tagId',isAuthenticated, expenseController.filterByTag);
router.post('/:id',isAuthenticated, expenseController.update);
router.post('/:id/delete',isAuthenticated, expenseController.delete);

module.exports = router;
