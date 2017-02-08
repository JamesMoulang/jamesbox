import React, { Component } from 'react';
import _ from 'underscore';
import { Router, Route, Link, browserHistory } from 'react-router'
import io from 'socket.io-client';
import { hostGame, setRoom } from '../../actions/Login';
import { connect } from 'react-redux';
import container from '../visual/container';

function mapStateToProps(state) {
  return {
    isFetching: state.Login.isFetching,
    player: state.Login.player,
    socket: state.Login.socket,
    room: state.Login.room,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hostGame: (socket, id) => {
      dispatch(hostGame(socket, id));
    },
    setRoom: (room) => {
    	dispatch(setRoom(room));
    },
  };
}

class HostOrLoginComponent extends Component {
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

	clickButton(route) {
		browserHistory.push('/' + route);
	}

	clickHost() {
		this.props.hostGame(this.props.socket, this.props.player.id);
	}

	buttonsDisabled() {
		if (this.props.isFetching || typeof(this.props.player) === 'undefined') {
			return ' disabled';
		} else {
			return '';
		}
	}

	render() {
		return (
			<div style={container}>
				<div className="row">
					<div className="col-sm-6">
						<button 
							type="button" 
							onClick={this.clickHost.bind(this)} 
							className={"btn btn-success btn-lg" + this.buttonsDisabled()}
						>
							Host a game
						</button>
					</div>
					<div className="col-sm-6">
						<div className="form-group">
							<button 
								type="button" 
								onClick={this.clickButton.bind(this, 'join')} 
								className={"btn btn-primary btn-lg" + this.buttonsDisabled()}
							>
								Join a game
							</button>
							<br/>
							<br/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const HostOrLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(HostOrLoginComponent);

export default HostOrLogin;