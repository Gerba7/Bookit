const UserDatabase = require('../../models/users/users.model');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');



const createAccessToken = (id, admin) => {
    return jwt.sign(
        {id, admin}, 
        process.env.ACCESS_TOKEN_SECRET, 
        {expiresIn: '45s'}
    );
}

const createRefreshToken = (id, admin) => {
    return jwt.sign(
        {id, admin}, 
        process.env.REFRESH_TOKEN_SECRET, 
        {expiresIn: '50m'}
    );
}



async function httpSignUp(req, res) {

    const user = req.body;
    
    if (!user.email || !user.password || !user.username ) {
        return res.status(400).json({error: 'You must fill all required fields'});
    };
    
    if (!validator.isEmail(user.email)) {
        return res.status(400).json({error:'Email is not valid'});
    };
    
    const userFound = await UserDatabase.exists({email: user.email});

    if (userFound) return res.status(400).json('Email already exists');

    const usernameFound = await UserDatabase.exists({username: user.username});

    if (usernameFound) return res.status(400).json('Username already exists');

    const saltRounds = 10; 
    const passwordHash = await bcrypt.hash(user.password, saltRounds);
    

    const newUser = new UserDatabase({
        username: user.username,
        email: user.email,
        password: passwordHash
    });
    
    // create token for signin after signup

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch(err) {
        res.status(400).json(err);
        console.log(err)
    };
        
};




async function httpLogIn(req, res) {

    const user = req.body;
    
    if (!user.email || !user.password) {
        return res.status(400).json({
            error: 'All fields are required',
        });
    };
    
    const userFound = await UserDatabase
        .findOne({email: user.email});
        //.populate("roles");

    if (!userFound) return res.status(400).json('User not found');

    const validPassword = await bcrypt.compare(user.password, userFound.password);

    if (!validPassword) return res.status(401).json({token: null, error: "Wrong password"});

    const { password, isAdmin, ...userData } = userFound._doc;

    const accessToken = createAccessToken(userFound._id, userFound.isAdmin);

    const refreshToken = createRefreshToken(userFound._id, userFound.isAdmin);

    res.cookie('accessToken', accessToken, {
        //domain: '.bookit.com',
        httpOnly: true, // accesible only by web server
        //secure: true, // when implementing https
        //sameSite: 'strict', // cross-site cookie
        maxAge: 45 * 1000 // cookie expiry match r tokne exp
    })

    res.cookie('refreshToken', refreshToken, {
        //domain: '.bookit.com',
        httpOnly: true, // accesible only by web server
        //secure: true, // when implementing https
        //sameSite: 'strict', // cross-site cookie
        maxAge: 50 * 60 * 1000 // cookie expiry match r tokne exp
    })

    res.cookie('li', 'true', {
        //domain: '.bookit.com',
        //secure: true, // when implementing https
        //sameSite: 'strict', // cross-site cookie
        maxAge: 50 * 60 * 1000 // cookie expiry match r tokne exp
    })

    if (userFound.isAdmin) {
        res.cookie('ia', 'true', {
            //domain: '.bookit.com',
            //secure: true, // when implementing https
            //sameSite: 'strict', // cross-site cookie
            maxAge: 50 * 60 * 1000 // cookie expiry match r tokne exp
        })
    }

    return res.status(200).json({userData});    //accessToken

};



async function refreshToken(req, res) {

    const refreshToken = req.cookies.refreshToken;
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async(err, decoded) => {
                
            if (err) return res.status(403).json('Unauthorized');
            
            const userFound = await UserDatabase.findOne({_id: decoded.id});

            if (!userFound) return res.status(403).json('User not found');

            const accessToken = createAccessToken(userFound._id, userFound.isAdmin);
            
            res.status(200).cookie('accessToken', accessToken, {
                //domain: '.bookit.com',
                httpOnly: true, // accesible only by web server
                //secure: true, // when implementing https
                //sameSite: 'strict', // cross-site cookie
                maxAge: 45 * 1000 // cookie expiry match r tokne exp
            })

            return res.status(200).json('ok')

        })
    )

};




async function verifyAdminToken (req, res, next) {
   
    const token = req.cookies.accessToken;
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
        asyncHandler(async(err, decoded) => {

            if (err) return res.status(403).json('You are not authorized!');
            
            req.user = decoded;
            
            if (req.user.admin) {
                next();
            } else {
                return res.status(403).json({message: "Requires administrator role"});
            };

        })
    );
};




async function verifyToken (req, res, next) {
    
    const token = req.cookies.accessToken;
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
        asyncHandler(async(err, decoded) => {

            if (err) return res.status(403).json('You are not authorized!');
            
            req.user = decoded;

            // if (req.user.id === req.params.id || req.user.isAdmin) {
            //     next()
            // } else {
            //     return res.status(403).json('You are not authorized!');
            // }
            
            next()

        })
    );
};



async function httpLogOut(req, res) {
console.log(req)
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) return res.status(204);

    res.clearCookie('refreshToken', { 
        //domain: '.lanuderia.com',
        httpOnly: true, // accesible only by web server
        //secure: true, // when implementing https
        //sameSite: 'strict', // cross-site cookie
    }); 

    res.clearCookie('li', {
        //domain: '.lanuderia.com',
        //secure: true, // when implementing https
        //sameSite: 'strict', // cross-site cookie
    });

    res.clearCookie('ia', {
        //domain: '.lanuderia.com',
        //secure: true, // when implementing https
        //sameSite: 'strict', // cross-site cookie
    });

    res.json({message: 'Cookie cleared'});

}






module.exports = {
    httpSignUp,
    httpLogIn,
    verifyAdminToken,
    verifyToken,
    refreshToken,
    httpLogOut
}