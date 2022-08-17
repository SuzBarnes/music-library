const express = require('express');

const artistRouter = require('./routes/artist');
const app = express();

app.use(express.json());

app.use('/artist', artistRouter);
app.delete('/artist/:artistId', artistRouter);

app.use('/artist/:artistId/album', artistRouter);

module.exports = app;
