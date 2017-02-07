export const SET_SOCKET = 'SET_SOCKET';
export function setSocket(socket) {
	return {
		type: SET_SOCKET,
		data: socket
	};
}

export const SET_PLAYER = 'SET_PLAYER';
export function setPlayer(player) {
	return {
		type: SET_PLAYER,
		data: player
	};
}

export const SUBMIT_NAME_REQUEST = 'SUBMIT_NAME_REQUEST';
export function submitNameRequest(name) {
	return {
		type: SUBMIT_NAME_REQUEST,
		data: name
	};
}

export const SUBMIT_NAME_SUCCESS = 'SUBMIT_NAME_SUCCESS';
export function submitNameSuccess(data) {
	return {
		type: SUBMIT_NAME_SUCCESS,
		data
	};
}

export const SUBMIT_NAME_FAILURE = 'SUBMIT_NAME_FAILURE';
export function submitNameFailure(error) {
	return {
		type: SUBMIT_NAME_FAILURE,
		data: error
	};
}

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