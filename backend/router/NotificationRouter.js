const express = require('express');
const authenticateToken = require('../MiddleWare/Auth');
const { ListNotifications, MarkNotificationsRead, DeleteNotification, DeleteAllNotifications } = require('../Controller/NotificationController');

const notificationRoute = express.Router();
notificationRoute.use(authenticateToken);
notificationRoute.get('/', ListNotifications);
notificationRoute.patch('/read', MarkNotificationsRead);
notificationRoute.delete('/', DeleteAllNotifications);
notificationRoute.delete('/:notificationId', DeleteNotification);

module.exports = notificationRoute;