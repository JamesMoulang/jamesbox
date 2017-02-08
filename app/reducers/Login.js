import * as Actions from '../actions/Login';

export default function Login(state={
	socket: undefined,
	player: undefined,
	isFetching: false,
	error: undefined,
	room: undefined,
}, action) {
	switch(action.type){
		case Actions.SET_ROOM:
			return Object.assign({}, state, {room: action.data});
		case Actions.SET_SOCKET:
			return Object.assign({}, state, {socket: action.data});
		case Actions.SET_PLAYER:
			return Object.assign({}, state, {player: action.data});
		case Actions.SUBMIT_NAME_REQUEST:
			return Object.assign({}, state, {isFetching: true, error: undefined});
		case Actions.SUBMIT_NAME_SUCCESS:
			return Object.assign({}, state, {isFetching: false, player: action.data.player});
		case Actions.SUBMIT_NAME_FAILURE:
			return Object.assign({}, state, {isFetching: false, error: action.data});
		case Actions.HOST_GAME_REQUEST:
			return Object.assign({}, state, {isFetching: true, error: undefined});
		case Actions.HOST_GAME_SUCCESS:
			return Object.assign({}, state, {isFetching: false, player: action.data.player});
		case Actions.HOST_GAME_FAILURE:
			return Object.assign({}, state, {isFetching: false});
		case Actions.JOIN_GAME_REQUEST:
			return Object.assign({}, state, {isFetching: true, error: undefined})
		case Actions.JOIN_GAME_SUCCESS:
			return Object.assign({}, state, {isFetching: false, player: action.data.player})
		case Actions.JOIN_GAME_FAILURE:
			return Object.assign({}, state, {isFetching: false, error: action.data})
		default:
			return state;
	}
}