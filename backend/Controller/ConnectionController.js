const mongoose = require('mongoose');
const Connection = require('../model/Connection/ConnectionSchema');
const User = require('../model/User/UserSchema');
const Message = require('../model/Message/MessageSchema');
const { getPublicUser } = require('./UserController/UserController');

const getPairKey = (first, second) => [String(first), String(second)].sort().join(':');
const isMember = (connection, userId) => [String(connection.requester?._id || connection.requester), String(connection.recipient?._id || connection.recipient)].includes(String(userId));
const otherUser = (connection, userId) => String(connection.requester?._id || connection.requester) === String(userId) ? connection.recipient : connection.requester;
const connectionView = (connection, userId, lastMessage) => ({
    _id: connection._id,
    status: connection.status,
    requestedBy: String(connection.requester?._id || connection.requester),
    user: getPublicUser(otherUser(connection, userId)),
    lastMessage: lastMessage ? { body: lastMessage.body, createdAt: lastMessage.createdAt, sender: lastMessage.sender } : null,
});

const SendConnectionRequest = async (req, res) => {
    const requesterId = req.user.userId;
    const recipientId = req.params.userId;
    if (!mongoose.isValidObjectId(recipientId) || String(requesterId) === String(recipientId)) return res.status(400).json({ message: 'Choose another user.' });
    try {
        const recipient = await User.findById(recipientId);
        if (!recipient) return res.status(404).json({ message: 'User not found' });
        const connection = await Connection.findOneAndUpdate(
            { pairKey: getPairKey(requesterId, recipientId) },
            { $setOnInsert: { pairKey: getPairKey(requesterId, recipientId), requester: requesterId, recipient: recipientId, status: 'pending' } },
            { new: true, upsert: true, setDefaultsOnInsert: true },
        );
        if (connection.status !== 'pending' || String(connection.requester) !== String(requesterId)) return res.status(409).json({ message: connection.status === 'accepted' ? 'You are already connected.' : 'This connection request already exists.' });
        res.status(201).json({ message: 'Connection request sent.', connectionId: connection._id });
    } catch (err) {
        res.status(500).json({ message: 'Could not send connection request', error: err.message });
    }
};

const ListConnections = async (req, res) => {
    try {
        const connections = await Connection.find({ $or: [{ requester: req.user.userId }, { recipient: req.user.userId }] })
            .populate('requester', 'name email phone linkedInUrl xUrl professionalField role photoUrl governmentIdType governmentIdLast4 verificationStatus')
            .populate('recipient', 'name email phone linkedInUrl xUrl professionalField role photoUrl governmentIdType governmentIdLast4 verificationStatus')
            .sort({ updatedAt: -1 });
        const accepted = connections.filter((item) => item.status === 'accepted');
        const lastMessages = await Message.aggregate([
            { $match: { connection: { $in: accepted.map((item) => item._id) } } },
            { $sort: { createdAt: -1 } },
            { $group: { _id: '$connection', message: { $first: '$$ROOT' } } },
        ]);
        const latestByConnection = new Map(lastMessages.map((item) => [String(item._id), item.message]));
        res.json({
            connections: accepted.map((item) => connectionView(item, req.user.userId, latestByConnection.get(String(item._id)))),
            requests: connections.filter((item) => item.status === 'pending').map((item) => connectionView(item, req.user.userId)),
        });
    } catch (err) {
        res.status(500).json({ message: 'Could not load connections', error: err.message });
    }
};

const AcceptConnectionRequest = async (req, res) => {
    try {
        const connection = await Connection.findOneAndUpdate(
            { _id: req.params.connectionId, recipient: req.user.userId, status: 'pending' },
            { status: 'accepted' },
            { new: true },
        ).populate('requester', 'name email phone linkedInUrl xUrl professionalField role photoUrl governmentIdType governmentIdLast4 verificationStatus').populate('recipient', 'name email phone linkedInUrl xUrl professionalField role photoUrl governmentIdType governmentIdLast4 verificationStatus');
        if (!connection) return res.status(404).json({ message: 'Connection request not found' });
        res.json({ message: 'Connection accepted.', connection: connectionView(connection, req.user.userId) });
    } catch (err) {
        res.status(500).json({ message: 'Could not accept connection', error: err.message });
    }
};

const GetConversation = async (req, res) => {
    try {
        const connection = await Connection.findOne({ _id: req.params.connectionId, status: 'accepted' })
            .populate('requester', 'name email phone linkedInUrl xUrl professionalField role photoUrl governmentIdType governmentIdLast4 verificationStatus')
            .populate('recipient', 'name email phone linkedInUrl xUrl professionalField role photoUrl governmentIdType governmentIdLast4 verificationStatus');
        if (!connection || !isMember(connection, req.user.userId)) return res.status(404).json({ message: 'Conversation not found' });
        const messages = await Message.find({ connection: connection._id }).sort({ createdAt: 1 }).populate('sender', 'name photoUrl');
        await Message.updateMany({ connection: connection._id, recipient: req.user.userId, readAt: null }, { readAt: new Date() });
        res.json({ connection: connectionView(connection, req.user.userId), messages });
    } catch (err) {
        res.status(500).json({ message: 'Could not load conversation', error: err.message });
    }
};

const CreateMessage = async (req, res) => {
    const body = req.body.body?.trim();
    if (!body) return res.status(400).json({ message: 'Message cannot be empty.' });
    try {
        const connection = await Connection.findOne({ _id: req.params.connectionId, status: 'accepted' });
        if (!connection || !isMember(connection, req.user.userId)) return res.status(404).json({ message: 'Conversation not found' });
        const recipientId = otherUser(connection, req.user.userId)._id || otherUser(connection, req.user.userId);
        const message = await Message.create({ connection: connection._id, sender: req.user.userId, recipient: recipientId, body });
        const populated = await message.populate('sender', 'name photoUrl');
        res.status(201).json({ message: populated });
    } catch (err) {
        res.status(500).json({ message: 'Could not send message', error: err.message });
    }
};

module.exports = { SendConnectionRequest, ListConnections, AcceptConnectionRequest, GetConversation, CreateMessage, getPairKey, isMember, otherUser };
