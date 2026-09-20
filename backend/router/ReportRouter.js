const express = require('express');
const { createReport, uploadReportAttachment } = require('../Controller/ReportController');

const reportRoute = express.Router();
reportRoute.post('/', uploadReportAttachment, createReport);

module.exports = reportRoute;
