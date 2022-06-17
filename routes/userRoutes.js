const express = require('express');
const {
  getAllUsers,
  getUsers,
  addUsers,
} = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.route('/').get(authController.protect, getAllUsers).post(addUsers);

router.route('/:id').get(getUsers);

module.exports = router;
