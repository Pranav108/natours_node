const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({ body: 'Hello from server side', startAt: 'app.js' });
});

app.post('/', (req, res) => {
    res.send('You can post to this endpoint...');
});

const port = 3000;
app.listen(port, () => console.log(`App running on ${port}...`));