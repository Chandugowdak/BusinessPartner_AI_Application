const mongoose = require('mongoose');

const EmailScheduleSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate', required: true },
    recipient: { type: String, required: true, maxlength: 254 },
    variables: { type: mongoose.Schema.Types.Mixed, default: {} },
    time: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    timezone: { type: String, required: true },
    cronExpression: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    nextRunAt: { type: Date, default: null },
    lastRunAt: { type: Date, default: null },
    lastRunStatus: { type: String, enum: ['sent', 'failed'], default: null },
    lastError: { type: String, maxlength: 1000, default: null },
    lastHistoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailHistory', default: null },
}, { timestamps: true });

EmailScheduleSchema.index({ enabled: 1, nextRunAt: 1 });
EmailScheduleSchema.index({ owner: 1, updatedAt: -1 });
EmailScheduleSchema.index({ owner: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('EmailSchedule', EmailScheduleSchema);
