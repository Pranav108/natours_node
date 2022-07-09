const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'A rating must be more then or equal to 1'],
      max: [5, 'A rating must be less then or equal to 5'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a Tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a User'],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//Middleware
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo -_id' });

  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
