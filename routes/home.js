const express = require("express");
const router = express.Router();
const paginate = require("express-paginate");
const HomeController = require('../controllers/HomeController');

router.get("/", paginate.middleware(10,50), HomeController.index);
router.get("/about", HomeController.about);
router.get("/dashboard", HomeController.dashboard);
router.get("/contacts", HomeController.contacts);

module.exports = router;
