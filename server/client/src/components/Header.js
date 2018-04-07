import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import 'react-day-picker/lib/style.css';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import DatePicker from './DatePicker';

class Header extends Component {
  isLoggedIn() {
    if (this.props.auth.data !== '') {
      return true;
    }
    return false;
  }
  isLoadingAuth() {
    return this.props.auth.isLoading === true;
  }

  renderAuthNav() {
    if (this.isLoadingAuth()) {
      return null;
    } else if (!this.isLoggedIn()) {
      return (
        <Nav pullRight>
          <NavItem href="/auth/google">Login with Google</NavItem>
        </Nav>
      );
    }
    return (
      <Nav pullRight>
        <NavItem href="/api/logout">Logout</NavItem>
      </Nav>
    );
  }
  renderDatePicker() {
    if (this.isLoggedIn()) {
      return <DatePicker />;
    }
    return null;
  }

  renderFeaturesNav() {
    return (
      <Nav>
        {this.isLoggedIn() ? (
          <NavItem>
            <Link to="/dashboard">My Meals</Link>
          </NavItem>
        ) : null}
      </Nav>
    );
  }
  render() {
    return (
      <Navbar collapseOnSelect fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={this.isLoggedIn() ? '/dashboard' : '/'}>
              KaloriRaptorit
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.renderFeaturesNav()}
          {this.renderDatePicker()}
          {this.renderAuthNav()}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

function mapsStateToProps({ auth, date }) {
  return { auth, date };
}

export default connect(mapsStateToProps, null)(Header);
