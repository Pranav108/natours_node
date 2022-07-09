const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filterObject = {};
  //check if we came from tour routes then find review with given tour_ID
  if (req.params.tourId) filterObject = { tour: req.params.tourId };

  const reviewData = await Review.find(filterObject);
  res.status(200).json({
    status: 'Success',
    length: reviewData.length,
    data: reviewData,
  });
});

exports.addReview = catchAsync(async (req, res, next) => {
  if (req.params.tourId) req.body.tour = req.params.tourId;
  req.body.user = req.user.id;

  const newReviews = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { review: newReviews },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const reviewData = await Review.findById(req.params.id);
  if (!reviewData)
    return next(new AppError('No review found with given ID', 404));

  res.status(200).json({
    status: 'success',
    data: { review: reviewData },
  });
});
