const express = require('express');
const authenticateToken = require('../MiddleWare/Auth');
const { requireFeature } = require('../MiddleWare/Permissions');
const { SendConnectionRequest, ListConnections, ListConnectionRequests, AcceptConnectionRequest, RejectConnectionRequest, CancelConnectionRequest, GetConversation, CreateMessage } = require('../Controller/ConnectionController');

const connectionRoute = express.Router();
connectionRoute.use(authenticateToken);
connectionRoute.get('/', requireFeature('connections'), ListConnections);
connectionRoute.get('/requests', requireFeature('requests'), ListConnectionRequests);
connectionRoute.post('/request/:userId', requireFeature('requests'), SendConnectionRequest);
connectionRoute.patch('/:connectionId/accept', requireFeature('requests'), AcceptConnectionRequest);
connectionRoute.patch('/:connectionId/reject', requireFeature('requests'), RejectConnectionRequest);
connectionRoute.patch('/:connectionId/cancel', requireFeature('requests'), CancelConnectionRequest);
connectionRoute.get('/:connectionId/messages', requireFeature('connections'), GetConversation);
connectionRoute.post('/:connectionId/messages', requireFeature('connections'), CreateMessage);

module.exports = connectionRoute;
