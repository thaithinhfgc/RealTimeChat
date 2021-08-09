const { Socket } = require('dgram');
const express = require('express');
const { SocketAddress } = require('net');
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(process.env.PORT || 3000);

var listUser = [];

io.on('connection', function (socket) {
    console.log('Connected: ' + socket.id);

    socket.on('disconnect', function () {
        console.log('disconnected: ' + socket.id);
        listUser.splice(
            listUser.indexOf(socket.userName), 1
        );
        socket.broadcast.emit('Server-send-list-user', listUser);
    });

    socket.on('Client-send-userName', function (userName) {
        console.log(userName);
        if (listUser.indexOf(userName) >= 0) {
            socket.emit('Server-send-fail-message');
        } else {
            listUser.push(userName);
            socket.userName = userName;
            socket.emit('Server-send-success-message', userName);
            io.sockets.emit('Server-send-list-user', listUser);
        }
    });

    socket.on('Client-send-logout', function () {
        listUser.splice(
            listUser.indexOf(socket.userName), 1
        );
        socket.broadcast.emit('Server-send-list-user', listUser);
    });

    socket.on('Client-send-message', function (txtMessage) {
        socket.mess = txtMessage;
        io.sockets.emit('Server-send-message', { un: socket.userName, mess: socket.mess });
        console.log(socket.id + "send: " + socket.mess);
    });

    socket.on('Client-typing-message', function () {
        data = socket.userName + ' đang soạn tin...';
        socket.broadcast.emit('Someone-typing-message', data);
    });

    socket.on('Client-stop-typing-message', function () {
        data = socket.userName + ' ngừng soạn tin...';
        socket.broadcast.emit('Someone-stop-typing-message', data);
    })
});

app.get('/', function (req, res) {
    res.render('home');
});