const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const data_base = require('./config/db');
const Connection = require('./model/Connection/ConnectionSchema');
const Message = require('./model/Message/MessageSchema');
const { isMember, otherUser } = require('./Controller/ConnectionController');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true, credentials: true } });
const PORT = process.env.PORT || 5000;
// Importing the userRoute
const userRoute = require('./router/UserRouter/Userroute');
const connectionRoute = require('./router/ConnectionRouter');
const notificationRoute = require('./router/NotificationRouter');







app.use('/api/user', userRoute); // Mount the userRoute at /api/user
app.use('/api/connections', connectionRoute);
app.use('/api/notifications', notificationRoute);

io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Access token required'));
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(new Error('Invalid token'));
        socket.user = user;
        next();
    });
});

io.on('connection', (socket) => {
    socket.on('join-conversation', async (connectionId, callback = () => {}) => {
        const connection = await Connection.findOne({ _id: connectionId, status: 'accepted' }).catch(() => null);
        if (!connection || !isMember(connection, socket.user.userId)) return callback({ error: 'Conversation not found' });
        socket.join(`connection:${connectionId}`);
        callback({ ok: true });
    });

    socket.on('send-message', async ({ connectionId, body }, callback = () => {}) => {
        const text = body?.trim();
        if (!text || text.length > 2000) return callback({ error: 'Message must be 1-2000 characters.' });
        const connection = await Connection.findOne({ _id: connectionId, status: 'accepted' }).catch(() => null);
        if (!connection || !isMember(connection, socket.user.userId)) return callback({ error: 'Conversation not found' });
        const recipient = otherUser(connection, socket.user.userId);
        const message = await Message.create({ connection: connectionId, sender: socket.user.userId, recipient, body: text });
        const populated = await message.populate('sender', 'name photoUrl');
        io.to(`connection:${connectionId}`).emit('new-message', populated);
        callback({ ok: true });
    });
});

data_base
    .then(() => {
        console.log('Database connected successfully');

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(`Error connecting to the database: ${err.message}`);
    });