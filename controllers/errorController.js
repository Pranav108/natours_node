const AppError = require('../utils/appError');

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    //Operational ,trusted error : Send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Programming or unknown Error: Send generic error
    res.status(500).json({
      status: 'ERROR',
      message: 'Something went wrong ;(',
    });
  }
};

//ERROR HANDLER FUNCTIONS
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const keys = Object.keys(err.keyValue).join(',');
  const message = `Duplicate field value for : ${keys} `;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const messageDescription = Object.values(err.errors)
    .map((el) => el.message)
    .join('.\n ');
  const message = `Invalid field value : ${messageDescription}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV.trim() === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err, name: err.name };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    sendProdError(error, res);
  } else {
    res.status(err.statusCode).json({
      status: 'wired error !!!',
      message:
        'You are neither in the production nor in the development environment',
    });
  }
};
