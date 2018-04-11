import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import 'react-day-picker/lib/style.css';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import '../css/navbar.css';

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

  renderFeaturesNav() {
    return (
      <Nav>
        {this.isLoggedIn() ? (
          <NavItem componentClass={Link} href="/meals" to="/meals">
            My Meals
          </NavItem>
        ) : null}
        {this.isLoggedIn() ? (
          <NavItem componentClass={Link} href="/trends" to="/trends">
            My Trends
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
            <Link to={this.isLoggedIn() ? '/meals' : '/'}>KaloriRaptorit</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.renderFeaturesNav()}
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
