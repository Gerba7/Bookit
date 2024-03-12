const ReservationsDatabase = require('../../models/reservations/reservations.model');
const AccommodationsDatabase = require('../../models/accommodations/accommodations.model');
const UsersDatabase = require('../../models/users/users.model');



async function httpCreateReservation(req, res) {
    
    const accommodationId = req.params.id;

    if (!accommodationId) {
        return res.status(404).json(
            "The hotel does not exists."
        );   
    };

    
    const newReservation = new ReservationsDatabase(req.body);

    
    try {

        const savedReservation = await newReservation.save();

        try {
            await AccommodationsDatabase.findByIdAndUpdate(accommodationId, {
                $push: {reservations: savedReservation._id}
            });
        } catch (err) {
            res.status(400).json("Error saving new Reservation in Accommodation.");
            console.log(err)
        }

        res.status(201).json(savedReservation);

    } catch (err) {
        res.status(400).json("Error creating new Reservation.");
        console.log(err)
    }
    
};




async function httpUpdateReservation(req, res) {
    
    try {
        const updatedReservation = await ReservationsDatabase.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedReservation)
    } catch (err) {
        console.log(err);
        res.status(400).json("Error updating the room");
    }

};



async function httpDeleteReservation(req, res) {

    const accommodationId = req.params.acId;

    try {
        await ReservationsDatabase.findByIdAndDelete(req.params.id);

        try {
            await AccommodationsDatabase.findByIdAndUpdate(accommodationId, {
                $pull: {reservations: req.params.id}
            })
        } catch (err) {
            res.status(400).json("Error deleting reservation in Accommodation.");
            console.log(err)
        }

        res.status(200).json("The reservation has been deleted successfully!");
    } catch (err) {
        res.status(400).json("Error deleting the reservation");
    };

};




async function httpGetReservation(req, res) {

    try {
        const reservation = await ReservationsDatabase.findById(req.params.id);
        res.status(200).json(reservation);
    } catch (err) {
        console.log(err)
        res.status(400).json("Error getting the room");
    };

};



async function httpGetAllReservations(req, res) {

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

        let rooms;
        let count;
        let pagesNumber;

        if (qNew) {
            rooms = await ReservationsDatabase.find({
                inStock: true,
            })
            .sort(sort)
            .limit(4);
            count = await ReservationsDatabase.count({
                inStock: true,
            })
            pagesNumber = Math.ceil(count / qLimit)
        } else if (qCategory) {
            rooms = await ReservationsDatabase.find({
                inStock: true,
                categories: {
                    $in: [qCategory],
                }
            })
            .sort(sort)
            .skip(qSkip)
            .limit(qLimit);
            count = await ReservationsDatabase.count({
                inStock: true,
                categories: {
                    $in: [qCategory],
                }
            })
            pagesNumber = Math.ceil(count / qLimit)
        } else if (qSearch) {
                reservations = await ReservationsDatabase.find({
                    'accommodationId.name': {$regex: qSearch, $options: 'i' },
                    'userId.username': { $regex: qSearch, $options: 'i' }
                })
                .populate({
                    path: 'accommodationId',
                    model: 'Accommodation',
                    select: 'name'
                })
                .populate({
                    path: 'userId',
                    model: 'User',
                    select: 'username'
                })
                .limit(qLimit)
                .skip(qSkip)
                count = await ReservationsDatabase.countDocuments({})
                pagesNumber = Math.ceil(count / qLimit) 
        } else if (qInStock) {
            reservations = await ReservationsDatabase.find({
                inStock: true,
            })
            .sort(sort)
            .skip(qSkip)
            .limit(qLimit)
            count = await ReservationsDatabase.count({
                inStock: true,
            })
            pagesNumber = Math.ceil(count / qLimit) 
        } else {
            reservations = await ReservationsDatabase.find()
            .populate({
                path: 'userId',
                model: UsersDatabase,
                select: 'username'
            })
            .populate({
                path: 'accommodationId',
                model: AccommodationsDatabase,
                select: 'name'
            })
            .sort(sort)
            .skip(qSkip)
            .limit(qLimit)
            .exec()
            count = await ReservationsDatabase.countDocuments({})
        };
 

        res.status(200).json({reservations, pagesNumber, count});

    } catch (err) {
        res.status(400).json("Error getting the reservations");
    };

};




module.exports = {
    httpCreateReservation,
    httpUpdateReservation,
    httpDeleteReservation,
    httpGetReservation,
    httpGetAllReservations
}
