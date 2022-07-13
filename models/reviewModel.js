const mongoose = require('mongoose');
const Tour = require('./tourModel');

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
      set: (val) => Math.round(val * 10) / 10,
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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//Middleware
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  else
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 0,
      ratingsQuantity: 4.5,
    });
};

//createNewReview
//findByIdAndUpdate
//findByIdAndUpdate
reviewSchema.post(/save|^findOneAnd/, async (doc) => {
  if (doc) await doc.constructor.calcAverageRatings(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
