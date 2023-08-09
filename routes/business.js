const express = require('express');
const router = express.Router();
const BusinessController = require('../controllers/BusinessController');
const isAuthenticated = require('../middlewares/authMiddleware');

// Get all businesses
router.get('/list', isAuthenticated, BusinessController.getAllBusinesses);

// Create bsuiness form
router.get('/new', isAuthenticated, BusinessController.getNewBusinessForm);

// Create a new business
router.post('/business', isAuthenticated, BusinessController.createBusiness);

// Get a business by id
router.get('/:id', isAuthenticated, BusinessController.getBusinessById);

// Update a business by id
router.put('/:id', isAuthenticated, BusinessController.updateBusiness);

// Delete a business by id
router.delete('/:id', isAuthenticated, BusinessController.deleteBusiness);

module.exports = router;
