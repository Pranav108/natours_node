const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    id: req.body._id,
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password)
    return next(new AppError('Please provide an email and password', 400));

  // 2) if user exist and password is correct
  const user = await User.findOne({ email }).select('+password');
  const isCorrect = await user.varifyPassword(password);
  if (!user || !isCorrect)
    return next(new Error('Please provide a valid credentials', 401));

  // 3) if everything is ok, send toke to the client
  res.status(200).json({
    result: 'success',
    token: signToken(user._id),
  });
});
