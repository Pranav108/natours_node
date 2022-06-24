const express = require('express');
const {
  getAllUsers,
  getUsers,
  addUsers,
  updateMyInfo,
  deleteMyAccount,
} = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMyInfo', authController.protect, updateMyInfo);
router.delete('/deleteMyAccount', authController.protect, deleteMyAccount);

router.route('/').get(authController.protect, getAllUsers).post(addUsers);

router.route('/:id').get(getUsers);

module.exports = router;
