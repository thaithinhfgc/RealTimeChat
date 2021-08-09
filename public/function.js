const socket = io('https://thinhrealchat.herokuapp.com/');

socket.on('Server-send-fail-message', function () {
    alert('Invalid User Name');
})

socket.on('Server-send-list-user', function (listUser) {
    $('#boxContent').html('');
    listUser.forEach(function (i) {
        $('#boxContent').append(" <div id='userOnline'></div>" + i);
    })
})

socket.on('Server-send-success-message', function (userName) {
    $('#currentUser').html(userName);
    $('#loginForm').hide(2000);
    $('#chatBox').show(1000);
});

socket.on('Server-send-message', function (data) {
    $('#listMessage').append("<div id='mess'>" + data.un + ": " + data.mess + "</div>")
});

socket.on('Someone-typing-message', function (data) {
    $('#notification').html(data);
});

socket.on('Someone-stop-typing-message', function (data) {
    $('#notification').html("");
});

$(document).ready(function () {
    $('#loginForm').show();
    $('#chatBox').hide();

    $('#btnRegister').click(function () {
        socket.emit('Client-send-userName', $('#userName').val());
    });

    $('#btnLogout').click(function () {
        socket.emit('Client-send-logout');
        $('#chatBox').hide(1000);
        $('#loginForm').show(1000);
    });

    $('#btnSend').click(function () {
        socket.emit('Client-send-message', $('#txtMessage').val());
    });

    $('#txtMessage').focusin(function () {
        socket.emit('Client-typing-message');
    });

    $('#txtMessage').focusout(function () {
        socket.emit('Client-stop-typing-message');
    });
});