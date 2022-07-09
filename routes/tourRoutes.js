const express = require('express');
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

//if we want review then go to review Routes
router.use('/:tourId/review', reviewRouter);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/top5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.addTours);

router
  .route('/:id')
  .get(tourController.getTours)
  .patch(tourController.updateTours)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTours
  );

module.exports = router;
