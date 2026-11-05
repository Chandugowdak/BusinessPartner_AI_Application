const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const EmailTemplate = require('../model/Email/EmailTemplateSchema');
const EmailHistory = require('../model/Email/EmailHistorySchema');

const HOURLY_SEND_LIMIT = 20;
const MAX_TEMPLATE_NAME_LENGTH = 80;
const MAX_SUBJECT_LENGTH = 200;
const MAX_BODY_LENGTH = 10000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEMPLATE_VARIABLE_PATTERN = /{{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*}}/g;
const isEtherealHost = (host) => /(^|\.)ethereal\.email$/i.test(host || '');

const getMailSettings = () => {
    const required = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS', 'MAIL_FROM'];
    const missingFields = required.filter((key) => !process.env[key]?.trim());
    const port = Number(process.env.MAIL_PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) missingFields.push('MAIL_PORT');

    return {
        missingFields: [...new Set(missingFields)],
        host: process.env.MAIL_HOST,
        port,
        secure: process.env.MAIL_SECURE === 'true',
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_HOST?.trim().toLowerCase() === 'smtp.gmail.com'
            ? process.env.MAIL_PASS?.replace(/\s/g, '')
            : process.env.MAIL_PASS,
        from: process.env.MAIL_FROM,
        testService: isEtherealHost(process.env.MAIL_HOST),
    };
};

const createTransporter = (settings) => nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: { user: settings.user, pass: settings.pass },
});

const getTemplateFields = (body = {}) => {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    if (!name || name.length > MAX_TEMPLATE_NAME_LENGTH) return { error: 'Template name must be 1-80 characters.' };
    if (!subject || subject.length > MAX_SUBJECT_LENGTH) return { error: 'Subject must be 1-200 characters.' };
    if (!content || content.length > MAX_BODY_LENGTH) return { error: 'Message must be 1-10000 characters.' };
    return { name, subject, content };
};

const listConfiguration = async (req, res) => {
    try {
        const [templates, settings] = await Promise.all([
            EmailTemplate.find({ owner: req.user.userId }).sort({ updatedAt: -1 }).lean(),
            Promise.resolve(getMailSettings()),
        ]);
        res.json({
            templates,
            mail: {
                configured: settings.missingFields.length === 0,
                missingFields: settings.missingFields,
                testService: settings.testService,
            },
        });
    } catch (error) {
        console.error('Email configuration could not be loaded:', error);
        res.status(500).json({ message: 'Email configuration could not be loaded.' });
    }
};

const createTemplate = async (req, res) => {
    const fields = getTemplateFields(req.body);
    if (fields.error) return res.status(400).json({ message: fields.error });

    try {
        const template = await EmailTemplate.create({ ...fields, owner: req.user.userId });
        res.status(201).json({ template });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: 'A template with that name already exists.' });
        console.error('Email template could not be created:', error);
        res.status(500).json({ message: 'Email template could not be created.' });
    }
};

const updateTemplate = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.templateId)) return res.status(400).json({ message: 'Invalid template ID.' });
    const fields = getTemplateFields(req.body);
    if (fields.error) return res.status(400).json({ message: fields.error });

    try {
        const template = await EmailTemplate.findOneAndUpdate(
            { _id: req.params.templateId, owner: req.user.userId },
            fields,
            { new: true, runValidators: true },
        );
        if (!template) return res.status(404).json({ message: 'Template not found.' });
        res.json({ template });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: 'A template with that name already exists.' });
        console.error('Email template could not be updated:', error);
        res.status(500).json({ message: 'Email template could not be updated.' });
    }
};

const deleteTemplate = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.templateId)) return res.status(400).json({ message: 'Invalid template ID.' });
    try {
        const result = await EmailTemplate.deleteOne({ _id: req.params.templateId, owner: req.user.userId });
        if (!result.deletedCount) return res.status(404).json({ message: 'Template not found.' });
        res.json({ message: 'Template deleted.' });
    } catch (error) {
        console.error('Email template could not be deleted:', error);
        res.status(500).json({ message: 'Email template could not be deleted.' });
    }
};

const testMailConfiguration = async (_req, res) => {
    const settings = getMailSettings();
    if (settings.missingFields.length) {
        return res.status(503).json({ message: 'Email delivery is not configured on the server.', missingFields: settings.missingFields });
    }
    try {
        await createTransporter(settings).verify();
        res.json({ message: 'SMTP connection verified.' });
    } catch (error) {
        console.error('SMTP connection verification failed:', error);
        res.status(502).json({ message: 'Could not verify the SMTP connection. Check the server mail settings.' });
    }
};

const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
}[character]));

const renderTemplate = (value, variables, isHtml = false) => value.replace(TEMPLATE_VARIABLE_PATTERN, (_match, key) => {
    const replacement = variables[key] ?? '';
    return isHtml ? escapeHtml(replacement) : replacement.replace(/[\r\n]/g, ' ');
});

const sendTemplate = async (req, res) => {
    const { templateId, to, variables = {} } = req.body || {};
    if (typeof to !== 'string' || to.length > 254 || !EMAIL_PATTERN.test(to.trim())) {
        return res.status(400).json({ message: 'Enter a valid recipient email address.' });
    }
    if (!mongoose.isValidObjectId(templateId)) return res.status(400).json({ message: 'Choose a valid email template.' });
    if (!variables || typeof variables !== 'object' || Array.isArray(variables)) {
        return res.status(400).json({ message: 'Template variables must be an object.' });
    }
    const variableEntries = Object.entries(variables);
    if (variableEntries.length > 20 || variableEntries.some(([key, value]) => (
        !/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(key) || typeof value !== 'string' || value.length > 500
    ))) {
        return res.status(400).json({ message: 'Template variables contain invalid values.' });
    }

    const settings = getMailSettings();
    if (settings.missingFields.length) {
        return res.status(503).json({ message: 'Email delivery is not configured on the server.', missingFields: settings.missingFields });
    }

    try {
        const template = await EmailTemplate.findOne({ _id: templateId, owner: req.user.userId });
        if (!template) return res.status(404).json({ message: 'Template not found.' });

        const since = new Date(Date.now() - 60 * 60 * 1000);
        const recentSends = await EmailHistory.countDocuments({ owner: req.user.userId, createdAt: { $gte: since } });
        if (recentSends >= HOURLY_SEND_LIMIT) {
            return res.status(429).json({ message: 'Email sending limit reached. Try again later.' });
        }

        const subject = renderTemplate(template.subject, variables).slice(0, MAX_SUBJECT_LENGTH);
        const content = renderTemplate(template.content, variables);
        const history = await EmailHistory.create({
            owner: req.user.userId,
            template: template._id,
            templateName: template.name,
            sender: settings.from,
            recipient: to.trim().toLowerCase(),
            subject,
            status: 'pending',
        });

        let info;
        let deliveryError;
        try {
            info = await createTransporter(settings).sendMail({
                from: settings.from,
                to: history.recipient,
                subject,
                text: content,
                html: escapeHtml(content).replace(/\r?\n/g, '<br>'),
            });
        } catch (error) {
            deliveryError = error;
        }

        const recipientAccepted = !deliveryError
            && Array.isArray(info?.accepted)
            && info.accepted.some((accepted) => String(accepted).trim().toLowerCase() === history.recipient);
        const isEthereal = settings.testService;
        const deliveredByConfiguredTransport = recipientAccepted && !isEthereal;

        if (!deliveredByConfiguredTransport) {
            history.status = 'failed';
            const failureReason = isEthereal && recipientAccepted
                ? 'Ethereal is a test email service. It captured this message for preview but does not deliver it to the recipient.'
                : typeof deliveryError?.message === 'string'
                    ? deliveryError.message
                    : 'The mail server did not accept the recipient.';
            history.failureReason = failureReason.slice(0, 2000);
            if (info?.messageId) history.providerMessageId = info.messageId;
            if (isEthereal && recipientAccepted) {
                history.previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
            }
        } else {
            history.status = 'sent';
            history.successMessage = 'Email accepted by the mail server. Inbox delivery is not confirmed.';
            history.providerMessageId = info.messageId;
        }

        try {
            await history.save();
        } catch (error) {
            console.error(`Email result could not be recorded for history ${history._id}:`, error);
            const message = deliveredByConfiguredTransport
                ? 'Email was accepted by the mail server, but its result could not be recorded. Check history before retrying.'
                : 'Email was not accepted by the mail server, but its result could not be recorded in history.';
            return res.status(500).json({ message, historyId: history._id });
        }

        if (!deliveredByConfiguredTransport) {
            if (deliveryError) console.error(`Email delivery failed for history ${history._id}:`, deliveryError);
            const message = isEthereal && recipientAccepted
                ? 'Ethereal captured this test email, but did not deliver it to the recipient. See the email history for its preview.'
                : 'Email could not be delivered. Check the email history for details.';
            return res.status(502).json({ message, historyId: history._id });
        }

        return res.status(200).json({ message: 'Email accepted by the mail server. Inbox delivery is not confirmed.', historyId: history._id });
    } catch (error) {
        console.error('Email send request failed:', error);
        return res.status(500).json({ message: 'Email could not be sent.' });
    }
};

const listEmailHistory = async (req, res) => {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    try {
        const filter = { owner: req.user.userId };
        const [entries, total] = await Promise.all([
            EmailHistory.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            EmailHistory.countDocuments(filter),
        ]);
        res.json({ entries, page, limit, total });
    } catch (error) {
        console.error('Email history could not be loaded:', error);
        res.status(500).json({ message: 'Email history could not be loaded.' });
    }
};

module.exports = {
    listConfiguration,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    testMailConfiguration,
    sendTemplate,
    listEmailHistory,
};
