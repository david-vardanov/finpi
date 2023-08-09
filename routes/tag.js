const express = require('express');
const router = express.Router();
const tagController = require('../controllers/TagController');
const isAuthenticated = require('../middlewares/authMiddleware');

router.get('/', isAuthenticated, tagController.list);
router.get('/create', isAuthenticated, tagController.create);
router.post('/', isAuthenticated, tagController.store);
router.get('/api/tags', tagController.search);
router.post('/api/create', tagController.createAjax);
router.get('/:id/edit', isAuthenticated, tagController.edit);
router.post('/:id', isAuthenticated, tagController.update);
router.post('/:id/delete', isAuthenticated, tagController.delete);

module.exports = router;
