const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    status: 'Success',
    length: user.length,
    data: user,
  });
});
exports.getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This router is yet to implement',
  });
};
exports.addUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This router is yet to implement',
  });
};
