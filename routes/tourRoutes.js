const express = require('express');
const { checkID, checkBody, getAllTours, getTours, addTours } = require('./../controllers/tourController');
const router = express.Router();

router.param('id', checkID);

router
    .route('/')
    .get(getAllTours)
    .post(checkBody, addTours);

router
    .route('/:id')
    .get(getTours);

module.exports = router;