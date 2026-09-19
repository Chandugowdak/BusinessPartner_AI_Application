const express = require('express');
const authenticateToken = require('../MiddleWare/Auth');
const { ListNotifications, MarkNotificationsRead } = require('../Controller/NotificationController');

const notificationRoute = express.Router();
notificationRoute.use(authenticateToken);
notificationRoute.get('/', ListNotifications);
notificationRoute.patch('/read', MarkNotificationsRead);

module.exports = notificationRoute;