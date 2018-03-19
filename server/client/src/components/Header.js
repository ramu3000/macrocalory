import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
  renderContent() {
    switch(this.props.auth) {
      case null:
        return;
      case false:
      return (
        <li><a href="/auth/google">Login With Google</a></li>
      );
    default:
      return (
        <li><a href="/api/logout">Logout</a></li>
      );
    }
  }

  render() {
    return (
      <nav>
        <div>
          <ul>
          <li><Link to={this.props.auth ? '/dashboard' : '/'}>This is fancy logo in header!</Link></li>
          {this.renderContent()}
          </ul>
        </div>
      </nav>
    );
  }
}

function mapsStateToProps({ auth }) {
  return { auth };
}

export default connect(mapsStateToProps)(Header);