const express = require('express');
const { httpCreateUser, httpUpdateUser, httpDeleteUser, httpGetUser, httpGetAllUsers } = require('./users.controller');


const usersRouter = express.Router();


usersRouter.post("/", httpCreateUser);
usersRouter.put("/:id", httpUpdateUser);
usersRouter.delete("/:id", httpDeleteUser);
usersRouter.get("/:id", httpGetUser);
usersRouter.get("/", httpGetAllUsers);




module.exports = usersRouter;