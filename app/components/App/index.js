import React, { Component } from 'react';
import _ from 'underscore';
import { Router, Route, Link, browserHistory } from 'react-router'
import io from 'socket.io-client';
import { setSocket, setPlayer } from '../../actions/Login';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    socket: state.Login.socket,
    player: state.Login.player,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSocket: (socket) => {
      dispatch(setSocket(socket));
    },
    setPlayer: (player) => {
      dispatch(setPlayer(player));
    }
  };
}

class AppComponent extends Component {
	componentDidMount() {
		const socket = io();
		this.props.setSocket(socket);

		socket.on('login', (data) => {
			console.log(data);

			if (localStorage.id) {
				// Then we need to tell the server that we're already logged in.
				console.log("we already have an id!");
				socket.emit('rejoin', {id: localStorage.id, tempID: data.id});
			} else {
				// Then this is the first time we've logged in and it's all good
				console.log("we don't already have an id!");
				localStorage.setItem('id', data.id);
				socket.emit('join', {id: data.id});
			}
		});

		socket.on('confirm', (data) => {
			this.props.setPlayer(data.player);
		});
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.player && this.props.player) {
			browserHistory.push('/login');
		}
	}

	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);

export default App;