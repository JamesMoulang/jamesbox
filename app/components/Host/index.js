import React, { Component } from 'react';
import _ from 'underscore';
import { Router, Route, Link, browserHistory } from 'react-router'
import io from 'socket.io-client';
import { setSocket, setPlayer } from '../../actions/Login';
import { connect } from 'react-redux';
import container from '../visual/container';

function mapStateToProps(state) {
  return {
    
  };
}

function mapDispatchToProps(dispatch) {
  return {
    
  };
}

class HostComponent extends Component {
	constructor(props) {
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
		
	}

	handleSubmit(event) {
		event.preventDefault();
		console.log(this.state.name);
		this.props.submitName(this.props.socket, this.props.player.id, this.state.name);
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

const Host = connect(
  mapStateToProps,
  mapDispatchToProps
)(HostComponent);

export default Host;