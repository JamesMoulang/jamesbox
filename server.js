"use strict";
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.js');
var uid = require('uid');
var _ = require('underscore');
var app = express();
var compiler = webpack(config);

var Player = require('./player');
var players = [];

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(path.join(__dirname, 'app', 'assets')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
	var id = uid();
	console.log("connection... " + id);
	socket.emit('login', {id});

	// Player has id in localstorage but may or may not exist in players array
	socket.on('rejoin', (data) => {
		console.log("A player thinks they have connected before with " + data.id);
		const player = _.findWhere(players, {id: data.id});
		if (player) {
			console.log("They were right, here is player " + data.id);
			player.online = true;
			id = data.id;
			socket.emit('confirm', {player});
		} else {
			console.log("I couldn't see them so I made a new player with id " + data.id);
			players.push(new Player(data.id));
			socket.emit('confirm', {player});
		}
	});

	// First time.
	socket.on('join', (data) => {
		console.log("someone is joining for the first time with id " + data.id);
		players.push(new Player(data.id));
		socket.emit('confirm', {player});
	});

	socket.on('disconnect', () => {
		console.log('user ' + id + ' disconnected');
		const player = _.findWhere(players, {id});
		if (player) {
			player.online = false;
		} else {
			console.log("but they never existed anyway? :(")
		}
	});

	socket.on('submitName', (data) => {
		const namePlayer = _.findWhere(players, {username: data.name});
		if (namePlayer) {
			socket.emit('submitNameFailure', {error: 'The name ' + data.name + ' is already taken'});
		} else {
			console.log(data);
			console.log("a player with id " + data.id + " is trying to submitName " + data.name);
			const player = _.findWhere(players, {id: data.id});
			if (player) {
				player.username = data.name;
				socket.emit('submitNameSuccess', {player});
			} else {
				socket.emit('submitNameFailure', {error: "The server doesn't recognise you."});
			}
		}
	});
});
server.listen(3000, function() {
	console.log("listening on port 3000");
});