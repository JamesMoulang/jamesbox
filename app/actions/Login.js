export const SET_SOCKET = 'SET_SOCKET';
export function setSocket(socket) {
	return {
		type: SET_SOCKET,
		data: socket
	};
};

export const SET_PLAYER = 'SET_PLAYER';
export function setPlayer(player) {
	return {
		type: SET_PLAYER,
		data: player
	};
};

export const SET_ROOM = 'SET_ROOM';
export function setRoom(room) {
	return {
		type: SET_ROOM,
		data: room
	};
};

// Submit Name

export const SUBMIT_NAME_REQUEST = 'SUBMIT_NAME_REQUEST';
export function submitNameRequest(name) {
	return {
		type: SUBMIT_NAME_REQUEST,
		data: name
	};
};

export const SUBMIT_NAME_SUCCESS = 'SUBMIT_NAME_SUCCESS';
export function submitNameSuccess(data) {
	return {
		type: SUBMIT_NAME_SUCCESS,
		data
	};
};

export const SUBMIT_NAME_FAILURE = 'SUBMIT_NAME_FAILURE';
export function submitNameFailure(error) {
	return {
		type: SUBMIT_NAME_FAILURE,
		data: error
	};
};

export function submitName(socket, id, name) {
  return function(dispatch) {
    dispatch(submitNameRequest({socket, id, name}));
    socket.on('submitNameFailure', (data) => {
    	dispatch(submitNameFailure(data));
    });
    socket.on('submitNameSuccess', (data) => {
    	dispatch(submitNameSuccess(data));
    });
    socket.emit('submitName', {name, id});
  };
}

// Host Game

export const HOST_GAME_REQUEST = 'HOST_GAME_REQUEST';
export function hostGameRequest() {
	return {
		type: HOST_GAME_REQUEST
	}
}

export const HOST_GAME_SUCCESS = 'HOST_GAME_SUCCESS';
export function hostGameSuccess(data) {
	return {
		type: HOST_GAME_SUCCESS,
		data
	}
}

export const HOST_GAME_FAILURE = 'HOST_GAME_FAILURE';
export function hostGameFailure(error) {
	return {
		type: HOST_GAME_FAILURE,
		data: error
	}
}

// socket: io
// id: the id of the player creating a game.
export function hostGame(socket, id) {
	return function(dispatch) {
		dispatch(hostGameRequest());
		socket.on('create_room_success', (data) => {
			dispatch(hostGameSuccess(data));
		});
		socket.on('create_room_failure', (data) => {
			dispatch(hostGameSuccess(data));
		});
		socket.emit('create_room', {id});
	}	
}

export const JOIN_GAME_REQUEST = 'JOIN_GAME_REQUEST';
export function joinGameRequest() {
	return {
		type: JOIN_GAME_REQUEST
	}
}

export const JOIN_GAME_SUCCESS = 'JOIN_GAME_SUCCESS';
export function joinGameSuccess(data) {
	return {
		type: JOIN_GAME_SUCCESS,
		data
	}
}

export const JOIN_GAME_FAILURE = 'JOIN_GAME_FAILURE';
export function joinGameFailure(error) {
	return {
		type: JOIN_GAME_FAILURE,
		error
	}
}

export function joinGame(socket, room, id) {
	return function(dispatch) {
		dispatch(joinGameRequest());
		socket.on('join_room_success', (data) => {
			dispatch(joinGameSuccess(data));
		});
		socket.on('join_room_failure', (data) => {
			dispatch(joinGameFailure(data));
		})
		socket.emit('join_room', {room, id});
	}
}