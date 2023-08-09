const express = require('express');
const router = express.Router();
const paginate = require('express-paginate');

const { validateLogin } = require('../middlewares/validation');
const isAuthenticated = require('../middlewares/authMiddleware');
const UserController = require('../controllers/UserController');

// Define login route
router.route('/login')
  .get(UserController.getLogin)
  .post(validateLogin, UserController.postLogin);

// Define logout route
router.route('/logout')
  .get(UserController.logout);

//NEW USER
router.get("/new", UserController.getNewUser);
router.post("/", UserController.postNewUser);

// Search
router.get("/search", isAuthenticated, UserController.getSearch);

router.get('/list', isAuthenticated, convertPageToNumber, paginate.middleware(10,50), UserController.getList);

function convertPageToNumber(req, res, next) {
  req.query.page = Number(req.query.page) || 1;
  next();
}


router.delete('/:id', UserController.deleteUser);

module.exports = router;
