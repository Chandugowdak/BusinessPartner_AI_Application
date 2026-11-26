const express = require('express');
const authenticateToken = require('../MiddleWare/Auth');
const { requireFeature } = require('../MiddleWare/Permissions');
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

emailRoute.get('/configuration', requireFeature('emailConfiguration'), listConfiguration);
emailRoute.post('/configuration/test', requireFeature('emailConfiguration'), testMailConfiguration);
emailRoute.post('/templates', requireFeature('emailConfiguration'), createTemplate);
emailRoute.put('/templates/:templateId', requireFeature('emailConfiguration'), updateTemplate);
emailRoute.delete('/templates/:templateId', requireFeature('emailConfiguration'), deleteTemplate);
emailRoute.post('/send', requireFeature('emailConfiguration'), sendTemplate);
emailRoute.get('/history', requireFeature('emailHistory'), listEmailHistory);
emailRoute.get('/schedules', requireFeature('emailScheduler'), listSchedules);
emailRoute.post('/schedules', requireFeature('emailScheduler'), createSchedule);
emailRoute.put('/schedules/:scheduleId', requireFeature('emailScheduler'), updateSchedule);
emailRoute.delete('/schedules/:scheduleId', requireFeature('emailScheduler'), deleteSchedule);

module.exports = emailRoute;
