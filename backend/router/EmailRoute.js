const express = require('express');
const authenticateToken = require('../MiddleWare/Auth');
const {
    listConfiguration,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    testMailConfiguration,
    sendTemplate,
    listEmailHistory,
} = require('../Controller/MailSenderController');
const {
    listSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
} = require('../Controller/EmailScheduleController');

const emailRoute = express.Router();
emailRoute.use(authenticateToken);

emailRoute.get('/configuration', listConfiguration);
emailRoute.post('/configuration/test', testMailConfiguration);
emailRoute.post('/templates', createTemplate);
emailRoute.put('/templates/:templateId', updateTemplate);
emailRoute.delete('/templates/:templateId', deleteTemplate);
emailRoute.post('/send', sendTemplate);
emailRoute.get('/history', listEmailHistory);
emailRoute.get('/schedules', listSchedules);
emailRoute.post('/schedules', createSchedule);
emailRoute.put('/schedules/:scheduleId', updateSchedule);
emailRoute.delete('/schedules/:scheduleId', deleteSchedule);

module.exports = emailRoute;
