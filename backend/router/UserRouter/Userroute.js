const {UserLogin , UserRegister, GetCurrentUser, GetAdminBootstrapStatus } = require('../../Controller/UserController/UserController');
const express = require('express');
const userRoute = express.Router();
const {HandleUserUpdate, ListUsers} = require('../../Controller/UserController/UserCrudOperation');
const authenticateToken = require('../../MiddleWare/Auth');
const { requireAdmin, requireFeature } = require('../../MiddleWare/Permissions');
const { listManagedUsers, updateUserPermissions, createManagedAdmin } = require('../../Controller/UserController/RolePermissionController');


userRoute.post('/login' , UserLogin);
userRoute.post('/register' , UserRegister);
userRoute.get('/admin-bootstrap-status', GetAdminBootstrapStatus);
userRoute.get('/me', authenticateToken, GetCurrentUser);
userRoute.get('/users', authenticateToken, requireFeature('findPartners'), ListUsers);
userRoute.put('/update/:userId', authenticateToken, HandleUserUpdate);
userRoute.get('/admin/users', authenticateToken, requireAdmin, listManagedUsers);
userRoute.post('/admin/users', authenticateToken, requireAdmin, createManagedAdmin);
userRoute.put('/admin/users/:userId/permissions', authenticateToken, requireAdmin, updateUserPermissions);

module.exports = userRoute; 