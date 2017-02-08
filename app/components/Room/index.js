import React, { Component } from 'react';
import _ from 'underscore';
import { Router, Route, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { submitName } from '../../actions/Login';
import container from '../visual/container';

function mapStateToProps(state) {
  return {
    player: state.Login.player,
    socket: state.Login.socket,
    room: state.Login.room
  };
}

function mapDispatchToProps(dispatch) {
  return {
    
  };
}

//todo: 'host / join screen.'

class RoomComponent extends Component {
	constructor(props) {
		console.log("Room");
		super(props);
		this.state = {
			name: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		if (this.props.room) {
			this.props.room.on('bump', (data) => {
				console.log(data);
			});
			this.props.room.on('players_update', (data) => {
				console.log("A player joined!");
			});
			this.props.room.emit('bump', 'HELLO WORLD');
			this.props.room.emit('join', this.props.player);
		}
	}

	componentDidUpdate(prevProps) {
		console.log(this.props.room);
	}

	handleSubmit(event) {
		event.preventDefault();
		console.log(this.state.name);
		this.props.submitName(this.props.socket, this.props.player.id, this.state.name);
	}

	bump() {
		this.props.room.emit('bump', 'HELLO WORLD');
	}

	handleChange(event) {
		this.setState({name: event.target.value});
	}

	render() {
		return (
			<div>
				<div style={{position: 'absolute', height: '80px', width: '100%', background: '#3F51B5', color: 'white'}}>
					<h1 style={{paddingLeft: '16px'}}>{'Room id: ' + this.props.room.nsp.replace('/', '')}</h1>
				</div>
				<div className="test" style={{paddingLeft: '16px', top: '80px', position: 'absolute', width: '100%', height: 'calc(100% - 80px)'}}>
					<button 
						type="button" 
						onClick={this.bump.bind(this)} 
						className={"btn btn-success btn-lg"}
					>
						Bump!
					</button>
				</div>
			</div>
		);
	}
}

const Room = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomComponent);

export default Room;