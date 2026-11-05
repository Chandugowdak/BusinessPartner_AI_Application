const mongoose = require('mongoose');

const EmailTemplateSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true, trim: true, maxlength: 10000 },
}, { timestamps: true });

EmailTemplateSchema.index({ owner: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);
