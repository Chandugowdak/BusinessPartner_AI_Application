const {UserLogin , UserRegister } = require('../../Controller/UserController/UserController');
const express = require('express');
const userRoute = express.Router();
const {HandleUserUpdate} = require('../../Controller/UserController/UserCrudOperation');


userRoute.post('/login' , UserLogin);
userRoute.post('/register' , UserRegister);
userRoute.put('/update/:userId', HandleUserUpdate);

module.exports = userRoute; 