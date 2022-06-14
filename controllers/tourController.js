const Tour = require('../models/tourModel');
const APIfeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,price,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIfeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const allToursData = await features.query;

  res.status(200).json({
    status: 'success',
    result: allToursData.length,
    data: { allToursData },
  });
});

exports.getTours = catchAsync(async (req, res, next) => {
  const tourData = await Tour.findById(req.params.id);
  if (!tourData) return next(new AppError('No tour found with that ID', 404));
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    data: { tour: tourData },
  });
});
exports.addTours = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { tour: newTour },
  });
});

exports.updateTours = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedTour)
    return next(new AppError('No tour found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: { updatedTour },
  });
});

exports.deleteTours = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);
  if (!deletedTour)
    return next(new AppError('No tour found with that ID', 404));
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: '$difficulty',
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
    { $match: { _id: { $ne: 'EASY' } } },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStats: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $sort: { numTourStats: -1 },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $limit: 6,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});
