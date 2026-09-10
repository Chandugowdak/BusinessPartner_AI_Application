const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['connection_request', 'connection_accepted'], required: true },
    connection: { type: mongoose.Schema.Types.ObjectId, ref: 'Connection', required: true },
    readAt: { type: Date, default: null },
}, { timestamps: true });

NotificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);