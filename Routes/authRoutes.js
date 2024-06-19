const express = require('express');
const authRouter = express.Router();  // for getting the router of express
const {signup,signin, getUser , logout} = require('../controller/authController.js'); // for getting the controller
const jwtAuth = require('../middleware/jwtauth');


//any rourter of express will take two parameters ... 1)path  2)controller(function that you want to perform when that path comes in link by users.)
authRouter.post('/signUp', signup);  // post is used when you want to submit data or also you can use it at place when you want to create something.
//    '/signUp' --->this is suffix only and prefix is already defined.

//below is creating router for singin
authRouter.post('/singin',signin);

//below is providing users details to user
authRouter.get('/user', jwtAuth , getUser); // phle verify karo login hai ki nhi then provide. note:- jwtauth mai "next()" jarur krna tb woo next function par jayega which is getUser() , warna nhi jayega

//below is creating router for Logout
authRouter.post('/logout',jwtAuth,logout);

module.exports = authRouter;