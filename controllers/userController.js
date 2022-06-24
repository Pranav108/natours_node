const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    status: 'Success',
    length: user.length,
    data: user,
  });
});

exports.updateMyInfo = catchAsync(async (req, res, next) => {
  //1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not to update password. Please user /updatePassword for that',
        400
      )
    );
  //2) filter out the unwanted fields that are not allowed to be updated
  const filterdBody = filterObject(req.body, 'name', 'email');

  //3) Update user info
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

exports.deleteMyAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
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
