// 0. set environment variables for development
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
// 1. set PORT and mongo uri
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

module.exports = { PORT, MONGO_URI };