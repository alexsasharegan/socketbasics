var socket = io();

socket.on('connect', function () {
	console.log('Connected to socket.io server');
});

socket.on('message', function (message) {
	var momentTimestamp = moment(message.timestamp, 'x').local().format('h:mma');
	$('.messages')
		.append('<p><strong>' + momentTimestamp + ': </strong>' + message.text + '</p>');

});

// handles submitting of new message
var $form = $('#message-form');
$form.on('submit', function (e) {
	e.preventDefault();
	$message = $form.find('input[name=message]');
	socket.emit('message', {text: $message.val()});
	$message.val('');
});
