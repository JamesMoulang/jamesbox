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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    submitName: (socket, id, name) => {
      dispatch(submitName(socket, id, name));
    }
  };
}

class LoginComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		if (typeof(this.props.player) !== 'undefined' && this.props.player.username) {
			console.log("username is set!");
			browserHistory.push('/hostOrLogin');
		}
	}

	componentDidUpdate() {
		if (typeof(this.props.player) !== 'undefined' && this.props.player.username) {
			console.log("username is set!");
			browserHistory.push('/hostOrLogin');
		}
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
					<h1>Enter your name</h1>
					<br/>
					<input className="form-control" type="text" value={this.state.name} onChange={this.handleChange} />
					<br/>
					<input className="btn btn-primary btn-lg" type="submit" value="Submit" />
				</form>
			</div>
		);
	}
}

const Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

export default Login;