const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    connection: { type: mongoose.Schema.Types.ObjectId, ref: 'Connection', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    readAt: { type: Date },
}, { timestamps: true });

MessageSchema.index({ connection: 1, createdAt: 1 });

module.exports = mongoose.model('Message', MessageSchema);
