const express = require('express');
const { httpCreateReview, httpUpdateReview, httpDeleteReview, httpGetReview, httpGetAllReviews } = require('./reviews.controller');


const reviewsRouter = express.Router();


reviewsRouter.post("/:id", httpCreateReview);
reviewsRouter.put("/:id", httpUpdateReview);
reviewsRouter.delete("/:id/:acId", httpDeleteReview);
reviewsRouter.get("/:id", httpGetReview);
reviewsRouter.get("/", httpGetAllReviews);




module.exports = reviewsRouter;