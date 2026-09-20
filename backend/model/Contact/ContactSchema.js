const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40 },
    subject: { type: String, required: true, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    status: { type: String, enum: ['new', 'in_progress', 'closed'], default: 'new', index: true },
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
