const express = require('express');
const { httpSignUp, httpLogIn, refreshToken, httpLogOut } = require('./auth.controller');


const authRouter = express.Router();


authRouter.post("/signup", httpSignUp);
authRouter.post("/login", httpLogIn);
authRouter.get("/refresh", refreshToken);
authRouter.post("/logout", httpLogOut);



module.exports = authRouter;