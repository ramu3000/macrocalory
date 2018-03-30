import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import 'react-day-picker/lib/style.css';
import {
  Button,
  Grid,
  Row,
  Col,
  Image,
  Panel
} from 'react-bootstrap';
import { fetchMeals } from '../actions';
import DatePicker from './DatePicker';

class Header extends Component {
  
  renderAuthButtons() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <a href="/auth/google">
            <Button className="btn_header" bsStyle="success">
              Google Login
            </Button>
          </a>
        );
      default:
        return (
          <a href="/api/logout">
            <Button className="btn_header" bsStyle="danger">
              Logout
            </Button>
          </a>
        );
    }
  }

  render() {
    return (
      <Panel>
        <Grid>
          <Row className="show-grid">
            <Col lg={2} sm={2} md={2} xs={2}>
              <Link to={this.props.auth ? '/dashboard' : '/'}>
                <Image src="/images/KR_logo.png" alt="KR-Logo" thumbnail />
              </Link>
            </Col>
            <Col lg={7} sm={7} md={7} xs={7}>
              <DatePicker />
            </Col>
            <Col>
            </Col>
            <Col lg={3} sm={3} md={3} xs={3}>
              {this.renderAuthButtons()}
            </Col>
          </Row>
        </Grid>
      </Panel>
    );
  }
}

function mapsStateToProps({ auth, date }) {
  return { auth, date };
}

export default connect(mapsStateToProps, { fetchMeals })(Header);
