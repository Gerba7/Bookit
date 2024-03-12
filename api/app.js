const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const api = require('./routes/api');

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));

app.use(helmet());


app.use(morgan('combined'));

app.use(cookieParser());

app.use(express.json());

app.use('/v1', api);

module.exports = app;
