const multer = require('multer');
const path = require('path');
const Report = require('../model/Report/ReportSchema');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, file, callback) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        callback(null, `report-${Date.now()}-${safeName}`);
    },
});

const uploadReportAttachment = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain'];
        callback(null, allowed.includes(file.mimetype));
    },
}).single('attachment');

const createReport = async (req, res) => {
    try {
        const { name, email, phone, reason, details } = req.body;
        if (!name || !email || !reason || !details) return res.status(400).json({ message: 'Name, email, reason, and details are required.' });
        const report = await Report.create({
            user: req.user?.userId || null,
            name,
            email,
            phone,
            reason,
            details,
            attachment: req.file ? {
                originalName: req.file.originalname,
                filename: req.file.filename,
                path: req.file.path,
                mimeType: req.file.mimetype,
                size: req.file.size,
            } : undefined,
        });
        res.status(201).json({ message: 'Report submitted successfully.', reportId: report._id });
    } catch (error) {
        res.status(500).json({ message: 'Unable to submit report.', error: error.message });
    }
};

module.exports = { uploadReportAttachment, createReport };
