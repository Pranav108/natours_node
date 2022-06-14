const express = require('express');
const {
  getAllUsers,
  getUsers,
  addUsers,
} = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);

router.route('/').get(getAllUsers).post(addUsers);

router.route('/:id').get(getUsers);

module.exports = router;
