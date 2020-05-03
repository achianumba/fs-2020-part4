const express = require('express');
const app = express()
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Blog routes middleware
app.use('/api/blogs', require('./controllers/blog'));

module.exports = app;