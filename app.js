const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

//  MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//  START SERVER
module.exports = app;