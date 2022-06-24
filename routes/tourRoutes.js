const express = require('express');
const authController = require('../controllers/authController');
const {
  getMonthlyPlan,
  getTourStats,
  aliasTopTour,
  getAllTours,
  getTours,
  addTours,
  updateTours,
  deleteTours,
} = require('../controllers/tourController');

const router = express.Router();
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/top5-cheap').get(aliasTopTour, getAllTours);
router.route('/').get(authController.protect, getAllTours).post(addTours);
router
  .route('/:id')
  .get(getTours)
  .patch(updateTours)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTours
  );

module.exports = router;
