import React, { Component } from 'react';
import _ from 'underscore';
import { Router, Route, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { joinGame, setRoom } from '../../actions/Login';
import container from '../visual/container';
import io from 'socket.io-client';

function mapStateToProps(state) {
  return {
    player: state.Login.player,
    socket: state.Login.socket,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    joinGame: (socket, room, id) => {
      dispatch(joinGame(socket, room, id));
    },
    setRoom: (room) => {
    	dispatch(setRoom(room));
    },
  };
}

//todo: 'host / join screen.'

class JoinComponent extends Component {
	constructor(props) {
		console.log("join");
		super(props);
		this.state = {
			name: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		
	}

	componentDidUpdate(prevProps) {
		if (typeof(this.props.player) !== 'undefined' && this.props.player.currentRoom) {
			// Then we have a room and we can move off.
			console.log("we have a room boi.");
			if (!this.props.room) {
				const room = io('/' + this.props.player.currentRoom);
				this.props.setRoom(room);
			}
			browserHistory.push('/room');
		} else {
			console.log("no room yet.");
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		console.log(this.state.name);
		this.props.joinGame(this.props.socket, this.state.name, this.props.player.id);
	}

	handleChange(event) {
		this.setState({name: event.target.value});
	}

	render() {
		return (
			<div style={container}>
				<br/>
				<form className="form-group" onSubmit={this.handleSubmit}>
					<h1>Enter game ID</h1>
					<br/>
					<input className="form-control" type="text" value={this.state.name} onChange={this.handleChange} />
					<br/>
					<input className="btn btn-primary btn-lg" type="submit" value="Submit" />
				</form>
			</div>
		);
	}
}

const Join = connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinComponent);

export default Join;