const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40 },
    reason: { type: String, required: true, trim: true, maxlength: 60 },
    details: { type: String, required: true, trim: true, maxlength: 4000 },
    attachment: {
        originalName: String,
        filename: String,
        path: String,
        mimeType: String,
        size: Number,
    },
    status: { type: String, enum: ['open', 'reviewing', 'resolved'], default: 'open', index: true },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
