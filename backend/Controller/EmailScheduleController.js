const mongoose = require('mongoose');
const EmailSchedule = require('../model/Email/EmailScheduleSchema');
const EmailTemplate = require('../model/Email/EmailTemplateSchema');
const { getNextDailyRun } = require('../Cron/EmailScheduler');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VARIABLE_KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]{0,39}$/;

const getScheduleFields = (body = {}) => {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const recipient = typeof body.recipient === 'string' ? body.recipient.trim() : '';
    const time = typeof body.time === 'string' ? body.time : '';
    const timezone = typeof body.timezone === 'string' ? body.timezone.trim() : '';
    const variables = body.variables ?? {};

    if (!name || name.length > 80) return { error: 'Schedule name must be 1-80 characters.' };
    if (!mongoose.isValidObjectId(body.templateId)) return { error: 'Choose a valid email template.' };
    if (recipient.length > 254 || !EMAIL_PATTERN.test(recipient)) return { error: 'Enter a valid recipient email address.' };
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return { error: 'Choose a valid daily run time.' };
    if (!timezone || timezone.length > 100) return { error: 'Choose a valid time zone.' };

    try {
        new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    } catch {
        return { error: 'Choose a supported time zone.' };
    }

    if (!variables || typeof variables !== 'object' || Array.isArray(variables)) {
        return { error: 'Template variables must be an object.' };
    }
    const variableEntries = Object.entries(variables);
    if (variableEntries.length > 20 || variableEntries.some(([key, value]) => (
        !VARIABLE_KEY_PATTERN.test(key) || typeof value !== 'string' || value.length > 500
    ))) {
        return { error: 'Template variables contain invalid values.' };
    }
    if (typeof body.enabled !== 'boolean') return { error: 'Choose whether this schedule is enabled.' };

    return {
        name,
        template: body.templateId,
        recipient,
        variables,
        time,
        timezone,
        cronExpression: `${Number(time.slice(3))} ${Number(time.slice(0, 2))} * * *`,
        enabled: body.enabled,
        nextRunAt: body.enabled ? getNextDailyRun(time, timezone) : null,
    };
};

const listSchedules = async (req, res) => {
    try {
        const schedules = await EmailSchedule.find({ owner: req.user.userId })
            .populate('template', 'name subject')
            .sort({ updatedAt: -1 })
            .lean();
        res.json({ schedules });
    } catch (error) {
        console.error('Email schedules could not be loaded:', error);
        res.status(500).json({ message: 'Email schedules could not be loaded.' });
    }
};

const createSchedule = async (req, res) => {
    const fields = getScheduleFields(req.body);
    if (fields.error) return res.status(400).json({ message: fields.error });
    try {
        const template = await EmailTemplate.findOne({ _id: fields.template, owner: req.user.userId }).select('_id');
        if (!template) return res.status(404).json({ message: 'Template not found.' });
        const schedule = await EmailSchedule.create({ ...fields, owner: req.user.userId });
        await schedule.populate('template', 'name subject');
        res.status(201).json({ schedule });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: 'A schedule with that name already exists.' });
        console.error('Email schedule could not be created:', error);
        res.status(500).json({ message: 'Email schedule could not be created.' });
    }
};

const updateSchedule = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.scheduleId)) return res.status(400).json({ message: 'Invalid schedule ID.' });
    const fields = getScheduleFields(req.body);
    if (fields.error) return res.status(400).json({ message: fields.error });
    try {
        const template = await EmailTemplate.findOne({ _id: fields.template, owner: req.user.userId }).select('_id');
        if (!template) return res.status(404).json({ message: 'Template not found.' });
        const schedule = await EmailSchedule.findOneAndUpdate(
            { _id: req.params.scheduleId, owner: req.user.userId },
            fields,
            { new: true, runValidators: true },
        ).populate('template', 'name subject');
        if (!schedule) return res.status(404).json({ message: 'Schedule not found.' });
        res.json({ schedule });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: 'A schedule with that name already exists.' });
        console.error('Email schedule could not be updated:', error);
        res.status(500).json({ message: 'Email schedule could not be updated.' });
    }
};

const deleteSchedule = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.scheduleId)) return res.status(400).json({ message: 'Invalid schedule ID.' });
    try {
        const result = await EmailSchedule.deleteOne({ _id: req.params.scheduleId, owner: req.user.userId });
        if (!result.deletedCount) return res.status(404).json({ message: 'Schedule not found.' });
        res.json({ message: 'Schedule deleted.' });
    } catch (error) {
        console.error('Email schedule could not be deleted:', error);
        res.status(500).json({ message: 'Email schedule could not be deleted.' });
    }
};

module.exports = { listSchedules, createSchedule, updateSchedule, deleteSchedule };
