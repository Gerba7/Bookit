const UsersDatabase = require('../../models/users/users.model');



async function httpCreateUser(req, res) {
    
    const existsUser = await UsersDatabase.findOne({username: req.body.username});

    if (existsUser) {
        return res.status(404).json(
            "The user already exists."
        );   
    };
    
    const newUser = new UsersDatabase(req.body);

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json("Error creating new User.");
        console.log(err)
    }
};



async function httpUpdateUser(req, res) {
    
    try {
        const updatedUser = await UsersDatabase.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedUser)
    } catch (err) {
        console.log(err);
        res.status(400).json("Error updating the user");
    }

};



async function httpDeleteUser(req, res) {

    try {
        await UsersDatabase.findByIdAndDelete(req.params.id);
        res.status(200).json("The user has been deleted successfully!");
    } catch (err) {
        res.status(400).json("Error deleting the user");
    };

};



async function httpGetUser(req, res) {

    try {
        const user = await UsersDatabase.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        console.log(err)
        res.status(400).json("Error getting the user");
    };

};



async function httpGetAllUsers(req, res) {
    
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

        let users;
        let count;
        let pagesNumber;

        if (qNew) {
            users = await UsersDatabase.find({
                inStock: true,
            })
            .sort(sort)
            .limit(4);
            count = await UsersDatabase.count({
                inStock: true,
            })
            pagesNumber = Math.ceil(count / qLimit)
        } else if (qCategory) {
            users = await UsersDatabase.find({
                inStock: true,
                categories: {
                    $in: [qCategory],
                }
            })
            .sort(sort)
            .skip(qSkip)
            .limit(qLimit);
            count = await UsersDatabase.count({
                inStock: true,
                categories: {
                    $in: [qCategory],
                }
            })
            pagesNumber = Math.ceil(count / qLimit)
        } else if (qSearch) {
                users = await UsersDatabase.find({
                    username: {$regex: qSearch, $options: 'i' },
                    email: {$regex: qSearch, $options: 'i' }
                })
                .sort(sort)
                .skip(qSkip)
                .limit(qLimit);
                count = await UsersDatabase.countDocuments({})
                pagesNumber = Math.ceil(count / qLimit) 
        } else if (qInStock) {
            users = await UsersDatabase.find({
                inStock: true,
            })
            .sort(sort)
            .skip(qSkip)
            .limit(qLimit)
            count = await UsersDatabase.count({
                inStock: true,
            })
            pagesNumber = Math.ceil(count / qLimit) 
        } else {
            users = await UsersDatabase.find()
            .sort(sort)
            .skip(qSkip)
            .limit(qLimit);
            count = await UsersDatabase.countDocuments({})
            pagesNumber = Math.ceil(count / qLimit) 
        };
 

        res.status(200).json({users, pagesNumber, count});

    } catch (err) {
        res.status(400).json("Error getting the users");
    };

};


module.exports = {
    httpCreateUser,
    httpUpdateUser,
    httpDeleteUser,
    httpGetUser,
    httpGetAllUsers,
}