const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT-EXCEPTION ERROR 💥 ....shutting down the server');
  process.exit(1);
});

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
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`App running on ${port}...`));

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLD-REJECTION ERROR 💥 ....shutting down the server');
  server.close(() => process.exit(1));
});
