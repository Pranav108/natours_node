const { promisify } = require('util');
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
    passwordChangedAt: req.body.passwordChangedAt,
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
    return next(new AppError('Please provide a valid credentials', 401));

  // 3) if everything is ok, send toke to the client
  res.status(200).json({
    result: 'success',
    token: signToken(user._id),
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token and checking if it is correct
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  )
    token = req.headers.authorization.split(' ')[1];
  if (!token)
    return next(
      new AppError(
        'You are not authorized to access this page. Please login first.'
      )
    );

  //2)Verifying the token
  const decodedInfo = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  //3)Check if user still exists
  const currentUser = await User.findById(decodedInfo.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );

  //4)Check id user changed the password after the token was issued
  if (currentUser.isPasswordChangedLater(decodedInfo.iat))
    return next(
      new AppError(
        'Recently password for this user has been changed. Please LogIn again',
        401
      )
    );

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
