const {UserLogin , UserRegister } = require('../../Controller/UserController/UserController');
const express = require('express');
const userRoute = express.Router();
const {HandleUserUpdate, ListUsers, UploadProfilePhoto} = require('../../Controller/UserController/UserCrudOperation');
const authenticateToken = require('../../MiddleWare/Auth');


userRoute.post('/login' , UserLogin);
userRoute.post('/register' , UserRegister);
userRoute.get('/users', authenticateToken, ListUsers);
userRoute.put('/update/:userId', authenticateToken, HandleUserUpdate);
userRoute.post('/photo/:userId', authenticateToken, UploadProfilePhoto);

module.exports = userRoute; 