const Notification = require('../model/Notification/NotificationSchema');

const notificationView = (notification) => ({
    _id: notification._id,
    type: notification.type,
    connection: notification.connection,
    actor: notification.actor,
    readAt: notification.readAt,
    createdAt: notification.createdAt,
});

const ListNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.userId })
            .populate('actor', 'name photoUrl')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({ notifications: notifications.map(notificationView), unreadCount: notifications.filter((item) => !item.readAt).length });
    } catch (err) {
        res.status(500).json({ message: 'Could not load notifications', error: err.message });
    }
};

const MarkNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user.userId, readAt: null }, { readAt: new Date() });
        res.json({ message: 'Notifications marked as read.' });
    } catch (err) {
        res.status(500).json({ message: 'Could not update notifications', error: err.message });
    }
};

module.exports = { ListNotifications, MarkNotificationsRead, notificationView };