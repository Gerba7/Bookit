const AccommodationsDatabase = require('../../models/accommodations/accommodations.model');
const { exec } = require('child_process')
const path = require('path')



async function httpCreateAccommodation(req, res) {

    const accommodation = req.body;
    
    const existsProd = await AccommodationsDatabase.findOne({name: accommodation.name});

    if (existsProd) {
        return res.status(404).json(
            "The hotel name already exists."
        );   
    };

    const extraPhotos = [
        "https://cf.bstatic.com/xdata/images/hotel/max1280x900/121402222.jpg?k=20556b9e8ddbbe0c34338375f843381a2c4f4c113a6d50d012559f114bdbac56&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/403985858.jpg?k=9d07336797a8e03c62832e9666892de67abb124f53e10c1ceee1fc4a61083bb6&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/403985859.jpg?k=57573f2d62c70fff26480b81e074b7e1708153d365a31d7b6298f02c3a39e525&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/13125863.jpg?k=f21d5d96d4efa1694138db9c64f1c27879af4ba5f1a2fc68a6f38f760cef4007&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/351072016.jpg?k=285441458d495d3c3cd30a7eeb934ab87eadceff9f2843523903c8ccf44b4616&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/336583079.jpg?k=1f649baaffed9f59d2ca80809a6e6d53363967e8e0639749ec30551359b24c64&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/336582317.jpg?k=29d57859ffc7bf7e673565e6d487a7acfff9ce4e9c3c6f13fc2a08c4e33b1f85&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/115648832.jpg?k=ad43d01c73b4866e7ad19068c6ef61b3ecb44c59f8d0862290fb9281e8eb2703&o=&hp=1"
    
    ]

    accommodation.photos.push(...extraPhotos);
    
    const newAccommodation = new AccommodationsDatabase(accommodation);


    try {
        const savedAccommodation = await newAccommodation.save();
        res.status(201).json(savedAccommodation);
    } catch (err) {
        res.status(400).json("Error creating new Accommodation.");
        console.log(err)
    }
};



async function httpUpdateAccommodation(req, res) {

    const updatedBody = req.body;

    const extraPhotos = [
        "https://cf.bstatic.com/xdata/images/hotel/max1280x900/121402222.jpg?k=20556b9e8ddbbe0c34338375f843381a2c4f4c113a6d50d012559f114bdbac56&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/403985858.jpg?k=9d07336797a8e03c62832e9666892de67abb124f53e10c1ceee1fc4a61083bb6&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/403985859.jpg?k=57573f2d62c70fff26480b81e074b7e1708153d365a31d7b6298f02c3a39e525&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/13125863.jpg?k=f21d5d96d4efa1694138db9c64f1c27879af4ba5f1a2fc68a6f38f760cef4007&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/351072016.jpg?k=285441458d495d3c3cd30a7eeb934ab87eadceff9f2843523903c8ccf44b4616&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/336583079.jpg?k=1f649baaffed9f59d2ca80809a6e6d53363967e8e0639749ec30551359b24c64&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/336582317.jpg?k=29d57859ffc7bf7e673565e6d487a7acfff9ce4e9c3c6f13fc2a08c4e33b1f85&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/115648832.jpg?k=ad43d01c73b4866e7ad19068c6ef61b3ecb44c59f8d0862290fb9281e8eb2703&o=&hp=1"
    
    ]

    updatedBody.photos.push(...extraPhotos);
    
    try {
        const updatedAccommodation = await AccommodationsDatabase.findByIdAndUpdate(req.params.id, {
            $set: updatedBody
        }, {new: true})
        res.status(200).json(updatedAccommodation)
    } catch (err) {
        console.log(err);
        res.status(400).json("Error updating the accommodation");
    }

};



async function httpDeleteAccommodation(req, res) {

    try {
        await AccommodationsDatabase.findByIdAndDelete(req.params.id);
        res.status(200).json("The accommodation has been deleted successfully!");
    } catch (err) {
        res.status(400).json("Error deleting the accommodation");
    };

};



async function httpGetScrappedAccommodations(req, res) {

    const arg1 = req.query.city;


    const runPythonScript = (arg1) => {
        return new Promise((resolve, reject) => {
            const pythonScriptPath = path.join(__dirname, '..', '..', 'services', 'scrape', 'scrapper.py');
    
            const pythonProcess = exec(
                `python ${pythonScriptPath} ${arg1}`,
                (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error executing Python script: ${error}`);
                        reject(error);
                        return;
                    }
    
                    const result = stdout.trim();
                    resolve(result);
                }
            );
    
            pythonProcess.stdin.end();
        });
    };
    
    
    try {

        const result = await runPythonScript(arg1);

        const jsonObject = JSON.parse(result);
        
        res.json({ result: jsonObject });
        

    } catch (err) {
        console.error(`Error in myControllerFunction: ${err}`);
        res.status(500).json({ error: 'Internal Server Error' });
    };

};



async function httpGetAccommodation(req, res) {
    
    
    try {
        const accommodation = await AccommodationsDatabase.findById(req.params.id);
        res.status(200).json(accommodation);
    } catch (err) {
        console.log(err)
        res.status(400).json("Error getting the accommodation");
    };

};




async function httpGetSearchAccommodation(req, res) {

    const { destination, dates, options} = req.body;

    const destinationLowerCase = destination.toLowerCase();

    // const startDate = dates[0]?.startDate;
    // const endDate = dates[0]?.startDate;

    
    try {
        const accommodation = await AccommodationsDatabase.aggregate([
            // Match by destination (city or country)
            {
              $match: {
                $or: [
                  { city:  { $regex: new RegExp(destinationLowerCase, 'i') } },
                  { country: { $regex: new RegExp(destinationLowerCase, 'i') } }
                ]
              }
            },
          ]);
          
          res.status(200).json(accommodation);
    } catch (err) {
        console.log(err)
        res.status(400).json("Error getting the accommodation");
    };

};



async function httpGetAllAccommodations(req, res) {

    const qNew = req.query.new;

    const qType = req.query.type;

    const qCity = req.query.city;
    
    const qSearch = req.query.search;

    const qFavourites = req.query.favourites;

    const qLimit = req.query.limit || 6;

    const qPage = req.query.page || 1;

    const qSkip = (qPage -1) * qLimit;

    const qSort = req.query.sort;
    
    let sort;

    if (qSort === 'asc') {
        sort = {rating: 1}
    } else if (qSort === 'desc') {
        sort = {rating: -1}
    } else {
        sort = {createdAt: -1}
    }
    
    
    try {

        let accomodations;
        let count;
        let pagesNumber;

        if (qNew) {
            accomodations = await AccommodationsDatabase.find({})
            .sort(sort)
            .limit(qLimit);
            count = await AccommodationsDatabase.countDocuments({})
            pagesNumber = Math.ceil(count / qLimit)
        } else if (qType) {
            accomodations = await AccommodationsDatabase.find({
                type: {
                    $in: [qType],
                }
            })
            .sort(sort)
            .skip(qSkip)
            .limit(qLimit);
            count = await AccommodationsDatabase.countDocuments({
                type: {
                    $in: [qType],
                }
            })
            pagesNumber = Math.ceil(count / qLimit)
        } else if (qCity) {
            accomodations = await AccommodationsDatabase.find({
                city: {
                    $in: new RegExp(qCity, 'i'),
                }
            })
            .sort(sort)
            .skip(qSkip)
            .limit(qLimit);
            count = await AccommodationsDatabase.countDocuments({
                city: {
                    $in: new RegExp(qCity, 'i'),
                }
            })
            pagesNumber = Math.ceil(count / qLimit)
        } else if (qSearch) {
            accomodations = await AccommodationsDatabase.find({
                name: {$regex: qSearch, $options: 'i' },
            })
            .limit(6)
            .skip(qSkip);
            count = await AccommodationsDatabase.countDocuments({})
            pagesNumber = Math.ceil(count / qLimit)
        } else if (qFavourites) {
            accomodations = await AccommodationsDatabase.find({
                rating: {$gt: 9, $lt: 10}
            })
            .sort({rating: -1})
            .limit(8)
        } else {
            accomodations = await AccommodationsDatabase.find()
            .sort(sort)
            .skip(qSkip)
            .limit(qLimit);
            count = await AccommodationsDatabase.countDocuments({})
            pagesNumber = Math.ceil(count / qLimit)
        };
 
        

        res.status(200).json({accomodations, pagesNumber, count});

    } catch (err) {
        console.log(err)
        res.status(400).json("Error getting the accommodations");
    };

};



module.exports = {
    httpCreateAccommodation,
    httpGetAllAccommodations,
    httpUpdateAccommodation,
    httpDeleteAccommodation,
    httpGetSearchAccommodation,
    httpGetAccommodation,
    httpGetScrappedAccommodations
}
