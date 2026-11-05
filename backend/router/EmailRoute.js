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

const emailRoute = express.Router();
emailRoute.use(authenticateToken);

emailRoute.get('/configuration', listConfiguration);
emailRoute.post('/configuration/test', testMailConfiguration);
emailRoute.post('/templates', createTemplate);
emailRoute.put('/templates/:templateId', updateTemplate);
emailRoute.delete('/templates/:templateId', deleteTemplate);
emailRoute.post('/send', sendTemplate);
emailRoute.get('/history', listEmailHistory);

module.exports = emailRoute;
