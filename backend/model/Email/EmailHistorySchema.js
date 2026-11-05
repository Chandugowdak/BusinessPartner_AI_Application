const mongoose = require('mongoose');

const EmailHistorySchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate', default: null },
    templateName: { type: String, required: true, maxlength: 80 },
    sender: { type: String, maxlength: 500 },
    recipient: { type: String, required: true, maxlength: 254 },
    subject: { type: String, required: true, maxlength: 200 },
    status: { type: String, enum: ['pending', 'sent', 'failed'], required: true, default: 'pending' },
    successMessage: { type: String, maxlength: 250 },
    failureReason: { type: String, maxlength: 2000 },
    providerMessageId: { type: String, maxlength: 500 },
    previewUrl: { type: String, maxlength: 2048 },
}, { timestamps: true });

EmailHistorySchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('EmailHistory', EmailHistorySchema);
