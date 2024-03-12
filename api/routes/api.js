const express = require('express');
const accommodationsRouter = require('./accommodations/accommodations.router');
const authRouter = require('./auth/auth.router');
const usersRouter = require('./users/users.router');
const reservationsRouter = require('./reservations/reservations.router');


const api = express.Router();

api.use('/auth', authRouter);
api.use('/accommodations', accommodationsRouter);
api.use('/users', usersRouter);
api.use('/reservations', reservationsRouter);



module.exports = api;