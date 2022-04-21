const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const allToursData = await Tour.find();
    res.status(200).json({
      status: 'success',
      result: allToursData.length,
      data: { allToursData },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failure',
      message: 'Unable to read data from DataBase',
    });
  }
};
exports.getTours = async (req, res) => {
  try {
    const tourData = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestedTime,
      data: { tour: tourData },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err,
    });
  }
};
exports.addTours = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failure',
      message: err,
    });
  }
};

exports.updateTours = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: { updatedTour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failure',
      message: err,
    });
  }
};

exports.deleteTours = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failure',
      message: err,
    });
  }
};
