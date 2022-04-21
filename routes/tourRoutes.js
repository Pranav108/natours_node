const express = require('express');
const {
  getAllTours,
  getTours,
  addTours,
  updateTours,
  deleteTours,
} = require('../controllers/tourController');

const router = express.Router();

router.route('/').get(getAllTours).post(addTours);
router.route('/:id').get(getTours).patch(updateTours).delete(deleteTours);

module.exports = router;
