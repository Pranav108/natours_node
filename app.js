const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();

// 1] MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
// app.use((req, res, next) => {
//     console.log("hello from middleware👋👋🏾👋🏻");
//     next();
// });
app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString();
    next();
});
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// app.get('/', (req, res) => {
//     res.status(200).json({ body: 'Hello from server side', startAt: 'app.js' });
// });
// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...');
// });

// 2] ROUTE-HANDELER
const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        //though I prefer -> data : tours
        data: { tours }
    });
};
const getTours = (req, res) => {
    // console.log(req.params);
    if (req.params.id >= tours.length)
        res.status(404).json({
            status: "failure",
            requestedAt: req.requestedTime,
            message: "Invalid ID",
            data: "tour not found"
        });
    else
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedTime,
            data: { tour: tours[req.params.id] }
        });
};
const addTour = (req, res) => {
    console.log(req.body);
    const newID = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours), err =>
        res.status(201).json({
            status: "success",
            data: { tour: newTour }
        }));
};
// 3] ROUTES
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTours);
// app.post('/api/v1/tours', addTour);
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(addTour);

app.route('/api/v1/tours/:id')
    .get(getTours);

const port = 3000;
app.listen(port, () => console.log(`App running on ${port}...`));