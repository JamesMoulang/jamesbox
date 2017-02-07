"use strict";

class Player {
	constructor(id) {
		this.id = id;
		this.online = true;
		this.username = null;
	}
}

module.exports = Player;