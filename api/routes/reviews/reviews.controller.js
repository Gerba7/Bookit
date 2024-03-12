const ReviewsDatabase = require('../../models/reviews/reviews.model');
const AccommodationsDatabase = require('../../models/accommodations/accommodations.model');



async function httpCreateReview(req, res) {
    
    const accommodationId = req.params.id;

    if (!accommodationId) {
        return res.status(404).json(
            "The hotel does not exists."
        );   
    };
    
    const newReview = new ReviewsDatabase(req.body);

    try {
        const savedReview = await newReview.save();

        try {
            await AccommodationsDatabase.findByIdAndUpdate(accommodationId, {
                $push: {rooms: savedReview._id}
            })
        } catch (err) {
            res.status(400).json("Error saving new Room in Accommodation.");
            console.log(err)
        }

        res.status(201).json(savedReview);

    } catch (err) {
        res.status(400).json("Error creating new Room.");
        console.log(err)
    }
};




async function httpUpdateReview(req, res) {
    
    try {
        const updatedReview = await ReviewsDatabase.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedReview)
    } catch (err) {
        console.log(err);
        res.status(400).json("Error updating the room");
    }

};



async function httpDeleteReview(req, res) {

    const accommodationId = req.params.acId;

    try {
        await ReviewsDatabase.findByIdAndDelete(req.params.id);

        try {
            await AccommodationsDatabase.findByIdAndUpdate(accommodationId, {
                $pull: {rooms: req.params.id}
            })
        } catch (err) {
            res.status(400).json("Error saving new Room in Accommodation.");
            console.log(err)
        }

        res.status(200).json("The room has been deleted successfully!");
    } catch (err) {
        res.status(400).json("Error deleting the room");
    };

};




async function httpGetReview(req, res) {

    try {
        const room = await ReviewsDatabase.findById(req.params.id);
        res.status(200).json(room);
    } catch (err) {
        console.log(err)
        res.status(400).json("Error getting the room");
    };

};



async function httpGetAllReviews(req, res) {

    const qNew = req.query.new;

    const qCategory = req.query.category;

    const qSearch = req.query.search;

    const qInStock = req.query.instock;

    const qLimit = req.query.limit || 2 ;

    const qPage = req.query.page || 1;

    const qSkip = (qPage -1) * qLimit;

    const qSort = req.query.sort;
    
    let sort;

    if (qSort === 'asc') {
        sort = {price: 1}
    } else if (qSort === 'desc') {
        sort = {price: -1}
    } else {
        sort = {createdAt: -1}
    }

    
    try {

        let reviews;
        let count;
        let pagesNumber;

        if (qNew) {
            reviews = await ReviewsDatabase.find({
                inStock: true,
            })
            .sort(sort)
            .limit(4);
            count = await ReviewsDatabase.count({
                inStock: true,
            })
            pagesNumber = Math.ceil(count / qLimit)
        } else if (qCategory) {
            reviews = await ReviewsDatabase.find({
                inStock: true,
                categories: {
                    $in: [qCategory],
                }
            })
            .sort(sort)
            .skip(qSkip)
            .limit(qLimit);
            count = await ReviewsDatabase.count({
                inStock: true,
                categories: {
                    $in: [qCategory],
                }
            })
            pagesNumber = Math.ceil(count / qLimit)
        } else if (qSearch) {
                reviews = await ReviewsDatabase.find({
                    inStock: true,
                    title: {$regex: qSearch, $options: 'i' },
                }).limit(10);
                return res.status(200).json(products.splice(0,5))
        } else if (qInStock) {
            reviews = await ReviewsDatabase.find({
                inStock: true,
            })
            .sort(sort)
            .skip(qSkip)
            .limit(qLimit)
            count = await ReviewsDatabase.count({
                inStock: true,
            })
            pagesNumber = Math.ceil(count / qLimit) 
        } else {
            reviews = await ReviewsDatabase.find();
        };
 
        

        res.status(200).json({reviews, pagesNumber});

    } catch (err) {
        res.status(400).json("Error getting the rooms");
    };

};




module.exports = {
    httpCreateReview,
    httpUpdateReview,
    httpDeleteReview,
    httpGetReview,
    httpGetAllReviews
}
