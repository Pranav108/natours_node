const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkID = (req, res, next, val) => {
    console.log(`value of id is ${val}`);
    if (req.params.id >= tours.length)
        return res.status(404).json({
            status: "failure",
            requestedAt: req.requestedTime,
            message: "Invalid ID",
            data: "tour not found"
        });
    next();
};

exports.checkBody = (req, res, next) => {
    console.log("this is check-body");
    if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('price'))
        return res.status(400).json({
            status: "failure",
            requestedAt: req.requestedTime,
            message: "bad request",
            data: {}
        });
    next();
};
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        //though I prefer -> data : tours
        data: { tours }
    });
};
exports.getTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedTime,
        data: { tour: tours[req.params.id] }
    });
};
exports.addTours = (req, res) => {
    console.log(req.body);
    const newID = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(tours), err =>
        res.status(201).json({
            status: "success",
            data: { tour: newTour }
        }));
};