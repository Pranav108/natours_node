const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

const tourModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

const Tour = mongoose.model('Tour', tourModel);

const testTour = new Tour({
  name: 'The Forest Hiker',
  price: 297,
  rating: 4.2,
});
testTour
  .save()
  .then((doc) => console.log(`Document saved successfully : ${doc}`))
  .catch((err) => console.log(`Unabe to save document 💥 ${err}`));

// console.log(process.env.NODE_ENV);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App running on ${port}...`));
