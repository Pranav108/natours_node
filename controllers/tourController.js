const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        //though I prefer -> data : tours
        data: { tours }
    });
};
exports.getTours = (req, res) => {
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