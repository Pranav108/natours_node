const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });
//we can implement for both the senario
//1)GET/POST  routes/
//2)POST  tours/tourId/review

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.addReview
  );

router.route('/:id').get(reviewController.getReview);

module.exports = router;
