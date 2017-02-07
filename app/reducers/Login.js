import * as Actions from '../actions/Login';

export default function Login(state={
	socket: undefined,
	player: undefined,
	isFetching: false,
	error: undefined
}, action) {
	switch(action.type){
		case Actions.SET_SOCKET:
			return Object.assign({}, state, {socket: action.data});
		case Actions.SET_PLAYER:
			return Object.assign({}, state, {player: action.data});
		case Actions.SUBMIT_NAME_REQUEST:
			return Object.assign({}, state, {isFetching: true});
		case Actions.SUBMIT_NAME_SUCCESS:
			return Object.assign({}, state, {isFetching: false, player: action.data.player});
		case Actions.SUBMIT_NAME_FAILURE:
			return Object.assign({}, state, {isFetching: false, error: action.data});
		default:
			return state;
	}
}