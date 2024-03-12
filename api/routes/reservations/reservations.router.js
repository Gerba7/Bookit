const express = require('express');
const { httpCreateReservation, httpUpdateRoom, httpDeleteRoom, httpGetRoom, httpGetAllReservations, httpUpdateReservation, httpDeleteReservation, httpGetReservation } = require('./reservations.controller');


const reservationsRouter = express.Router();


reservationsRouter.post("/:id", httpCreateReservation);
reservationsRouter.put("/:id", httpUpdateReservation);
reservationsRouter.delete("/:id/:acId", httpDeleteReservation);
reservationsRouter.get("/:id", httpGetReservation);
reservationsRouter.get("/", httpGetAllReservations);




module.exports = reservationsRouter;