const express = require('express');
const { httpCreateAccommodation, httpGetAllAccommodations, httpUpdateAccommodation,
    httpDeleteAccommodation, httpGetAccommodation, httpGetSearchAccommodation, httpGetScrappedAccommodations } = require('./accommodations.controller');
const { verifyToken, verifyAdminToken } = require('../auth/auth.controller');


const accommodationsRouter = express.Router();


accommodationsRouter.post("/", httpCreateAccommodation);
accommodationsRouter.put("/:id", httpUpdateAccommodation);
accommodationsRouter.delete("/:id", httpDeleteAccommodation);
accommodationsRouter.post("/search", httpGetSearchAccommodation);
accommodationsRouter.get("/scrape", httpGetScrappedAccommodations);
accommodationsRouter.get("/:id", httpGetAccommodation);
accommodationsRouter.get("/", httpGetAllAccommodations);




module.exports = accommodationsRouter;