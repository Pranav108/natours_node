const express = require('express');
const { getAllTours, getTours, addTours } = require('./../controllers/tourController');
const router = express.Router();

router
    .route('/')
    .get(getAllTours)
    .post(addTours);

router
    .route('/:id')
    .get(getTours);

module.exports = router;