const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utills/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utills/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Setting folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'admin';

//running the connection server
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', formatMessage(botName, 'Welcome to Chatapp'));
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joinned the chat`)
        );

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

//send the text message
socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message',formatMessage(user.username, msg));
});

//disconnection
socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if(user) {
        io.to(user.room).emit('message', formatMessage(botName,` ${user.username } has left the chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    }
});

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));