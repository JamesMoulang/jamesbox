import React, { Component } from 'react';
import _ from 'underscore';
import { Router, Route, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { submitName } from '../../actions/Login';

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
	componentDidUpdate() {
		if (this.props.player.username) {
			console.log("username is set!");
		}
	}

	constructor(props) {
		super(props);
		this.state = {
			name: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
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
			<div>
				<h1>Enter your name</h1>
				<form onSubmit={this.handleSubmit}>
					<input type="text" value={this.state.name} onChange={this.handleChange} />
					<input type="submit" value="Submit" />
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