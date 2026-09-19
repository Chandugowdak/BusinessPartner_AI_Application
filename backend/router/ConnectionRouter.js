const express = require('express');
const authenticateToken = require('../MiddleWare/Auth');
const { SendConnectionRequest, ListConnections, AcceptConnectionRequest, RejectConnectionRequest, GetConversation, CreateMessage } = require('../Controller/ConnectionController');

const connectionRoute = express.Router();
connectionRoute.use(authenticateToken);
connectionRoute.get('/', ListConnections);
connectionRoute.post('/request/:userId', SendConnectionRequest);
connectionRoute.patch('/:connectionId/accept', AcceptConnectionRequest);
connectionRoute.patch('/:connectionId/reject', RejectConnectionRequest);
connectionRoute.get('/:connectionId/messages', GetConversation);
connectionRoute.post('/:connectionId/messages', CreateMessage);

module.exports = connectionRoute;
