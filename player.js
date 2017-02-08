"use strict";

class Player {
	constructor(id) {
		this.id = id;
		this.online = true;
		this.username = null;
		this.currentRoom = null;
		this.hosting = null;
	}
}

module.exports = Player;