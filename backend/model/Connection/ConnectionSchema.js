const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
    pairKey: { type: String, required: true, unique: true, index: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending', index: true },
}, { timestamps: true });

module.exports = mongoose.model('Connection', ConnectionSchema);
