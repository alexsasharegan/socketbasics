var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	console.log('> User connected via socket.io');

	socket.on('message', function (message) {
		message.timestamp = moment().format('x');
		console.log(`> New message at ${message.timestamp}: ${message.text}`);
		io.emit('message', message);
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