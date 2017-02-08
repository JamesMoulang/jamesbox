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

const rooms = [];
const createRoom = (name) => {
	if (rooms.indexOf(name) === -1) {
		rooms.push(name);
		let room = io.of('/' + name);
		let room_players = {};

		room.on('connection', (socket) => {
			const room_player_id = uid();

			socket.emit('join_room_success', {room: name, players: room_players});

			socket.on('bump', (data) => {
				console.log("woah.");
				socket.emit('bump', 'bump!');
				socket.broadcast.emit('bump', 'bump!');
			});

			socket.on('join', (data) => {
				room_players[room_player_id] = data;
				socket.broadcast.emit('players_update', {players: room_players});
			});

			socket.on('disconnect', () => {
				if (room_players.hasOwnProperty(room_player_id)) {
					room_players[room_player_id] = undefined;
				}
				socket.broadcast.emit('players_update', {players: room_players});
			});
		});
	}
}

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
			console.log("And their name is " + player.username);
			player.online = true;
			id = data.id;
			socket.emit('confirm', {player});
		} else {
			console.log("I couldn't see them so I made a new player with id " + data.id);
			const player = new Player(data.id)
			players.push(player);
			socket.emit('confirm', {player});
		}
	});

	// First time.
	socket.on('join', (data) => {
		console.log("someone is joining for the first time with id " + data.id);
		const player = new Player(data.id);
		players.push(player);
		socket.emit('confirm', {player});
	});

	// Create a room.
	// Add this player to it.
	socket.on('create_room', (data) => {
		console.log("Creating a room...");
		const player = _.findWhere(players, {id: data.id});
		if (player) {
			var roomID = uid();
			createRoom(roomID);
			socket.join(roomID);
			player.currentRoom = roomID;
			player.hosting = roomID;
			socket.emit('create_room_success', {id: roomID, player});
		} else {
			socket.emit('create_room_failure', {error: "The server doesn't recognise you."});
		}
	});

	socket.on('join_room', (data) => {
		if (rooms.indexOf(data.room) !== -1) {
			const player = _.findWhere(players, {id: data.id});
			if (player) {
				socket.join(data.room);
				player.currentRoom = data.room;
				socket.emit('join_room_success', {id: data.room, player});
			} else {
				socket.emit('create_room_failure', {error: "The server doesn't recognise you."});
			}
		} else {
			socket.emit('join_room_failure', {error: 'No room with that id!'})
		}
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