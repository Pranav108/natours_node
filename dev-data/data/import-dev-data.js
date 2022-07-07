const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');

dotenv.config({ path: path.resolve(__dirname, './../../config.env') });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

//READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, `tours.json`), 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, `users.json`), 'utf-8')
);

//WRITE DATA
const addToursData = async () => {
  try {
    await Tour.create(tours);
    console.log('Tour Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const addUsersData = async () => {
  try {
    await User.create(users);
    console.log('User Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE DATA
const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--importUser') addUsersData();
else if (process.argv[2] === '--importTour') addToursData();
else if (process.argv[2] === '--delete') deleteData();
else console.log(`Can't find what are you looking for`);
