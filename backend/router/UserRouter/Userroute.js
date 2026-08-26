const {UserLogin , UserRegister } = require('../../Controller/UserController/UserController');
const express = require('express');
const userRoute = express.Router();


userRoute.post('/login' , UserLogin);
userRoute.post('/register' , UserRegister);

module.exports = userRoute; 