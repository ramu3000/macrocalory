import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import 'react-day-picker/lib/style.css';
import { Navbar, Nav, NavItem, Col, Row, Grid } from 'react-bootstrap';
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
          <NavItem componentClass={Link} href="/meals" to="/meals">
            My Meals
          </NavItem>
        ) : null}
      </Nav>
    );
  }
  render() {
    return (
      <div>
        <Navbar collapseOnSelect fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to={this.isLoggedIn() ? '/meals' : '/'}>
                KaloriRaptorit
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            {this.renderFeaturesNav()}
            {this.renderAuthNav()}
          </Navbar.Collapse>
        </Navbar>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={6} smPush={3} align="center">
              {this.renderDatePicker()}
            </Col>
            <Col xs={12} sm={3} smPull={6} align="center">
              {/*Placeholder for button panel column?*/}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

function mapsStateToProps({ auth, date }) {
  return { auth, date };
}

export default connect(mapsStateToProps, null)(Header);
