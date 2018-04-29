import React, { Component } from 'react';
import { connect } from 'react-redux';

class Landing extends Component {
  render() {
    if (this.props.auth.loading === true) {
      return <h2>Logging in...</h2>;
    } else if (this.props.auth.data === null || this.props.auth.data === '') {
      return <h2>Please log in to start healthy life with KaloriRaptorit.</h2>;
    } else {
      return <h2>Welcome {this.props.auth.data.name}!</h2>;
    }
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, null)(Landing);
