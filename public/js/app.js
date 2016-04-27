var name = getQueryVariable('name') || 'User';
var room = getQueryVariable('room');
var socket = io();

socket.on('connect', function () {
	console.log('Connected to socket.io server');
});

socket.on('message', function (message) {
	var momentTimestamp = moment(message.timestamp, 'x').local().format('h:mma');
	$message = $('.messages');
	
	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp + ': </strong>');
	
	$('.messages')
		.append('<p>' + message.text + '</p>');

});

// handles submitting of new message
var $form = $('#message-form');
$form.on('submit', function (e) {
	e.preventDefault();
	$message = $form.find('input[name=message]');
	socket.emit('message', {
		text: $message.val(),
		name: name
	});
	$message.val('');
});
