const mongoose = require('mongoose');

const tourModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name'],
    unique: true,
  },
  price: { type: Number, required: [true, 'A tour must have a price'] },
  rating: { type: Number, default: 4.5 },
});
const Tour = mongoose.model('Tour', tourModel);
module.exports = Tour;
