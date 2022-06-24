const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    id: req.body._id,
    role: req.body.role,
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password)
    return next(new AppError('Please provide an email and password', 400));

  // 2) if user exist and password is correct
  const user = await User.findOne({ email }).select('+password');
  const isCorrect = user && (await user.varifyPassword(password));
  if (!user || !isCorrect)
    return next(new AppError('Please provide a valid credentials', 401));

  // 3) if everything is ok, send toke to the client
  createSendToken(user, 200, res);
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

  //3)Check if user still exists-
  const currentUser = await User.findById(decodedInfo.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );

  //4)Check id user changed the password after the token was issued
  if (await currentUser.isPasswordChangedLater(decodedInfo.iat))
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

exports.restrictTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    //roles=['admin', 'user', 'manager'] actualRole = 'user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You don't have permission to Perform this Operation`, 403)
      );
    }
    next();
  });

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get User based on Posted Email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new AppError('There is no user with the given email address', 404)
    );

  //2) generate the random reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateModifiedOnly: true });

  //3) Send it to user's email address
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password to ${resetURL}\n
   If you didn't forgot your password please Ignore this Email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password reset token (Valid of 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent successfully ',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateModifiedOnly: true });
    return next(
      new AppError('Unable to send reset Password token. Try Again later.', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Reset Password based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) If token is not expired and user exists, set new password
  if (!user) return next(new AppError('Token is Invalid or expired.', 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 3) Save the values and set changedPasswordAt property
  await user.save();

  //4) Log the user In, send the JWT
  createSendToken(user, 201, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if given password match against current users
  const { passwordCurrent, password, passwordConfirm } = req.body;
  const isCorrect = await user.varifyPassword(passwordCurrent);
  if (!isCorrect) return next(new AppError('Current password is Invalid', 400));

  // 3) If So, Update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // 4) Log In user, send JWT
  createSendToken(user, 200, res);
});
