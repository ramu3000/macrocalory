import React, { Component } from 'react';
import { connect } from 'react-redux';

class UserSettings extends Component {
  renderFitbit() {
    const { data: userData } = this.props.auth;
    if (userData && userData.fitbit) {
      return <button className="btn btn-success">Connected to Fitbit</button>;
    }
    return (
      <button className="btn btn-primary" onClick={() => this.connectFitbit()}>
        Connect to Fitbit
      </button>
    );
  }
  connectFitbit() {
    window.location = '/connect/fitbit';
  }

  render() {
    console.log(this.props.auth);
    return (
      <div>
        <h1>User config</h1>
        {this.renderFitbit()}
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, null)(UserSettings);
