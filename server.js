var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};
function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return;
	}

	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: `Current users: ${users.join(', ')}`,
		timestamp: moment().format('x')
	});
}

io.on('connection', function (socket) {
	console.log('> User connected via socket.io');

	socket.on('disconnect', function () {
		if (typeof clientInfo[socket.id] !== 'undefined') {
			socket.leave(clientInfo[socket.id].room);
			io.to(clientInfo[socket.id].room).emit('message', {
				text: `${clientInfo[socket.id].name} has left.`,
				name: 'System',
				timestamp: moment().format('x')
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function (req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: `${req.name} has joined`,
			timestamp: moment().format('x')
		});
	});

	socket.on('message', function (message) {
		message.timestamp = moment().format('x');

		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
			console.log(`> @currentUsers command run by ${clientInfo[socket.id].name} at: ${message.timestamp}`);
		} else {
			io.to(clientInfo[socket.id].room).emit('message', message);
			console.log(`> New message at ${message.timestamp}: ${message.text}`);
		}
	});

	socket.emit('message', {
		text: 'Welcome to the chat application',
		timestamp: moment().format('x'),
		name: 'System'
	});
});

http.listen(PORT, function () {
	console.log('> server started');
});