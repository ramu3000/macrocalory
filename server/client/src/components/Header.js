import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Button,
  ButtonToolbar,
  Grid,
  Row,
  Col,
  Image,
  Panel
} from 'react-bootstrap';
import { chooseDate, fetchMeals } from '../actions';

class Header extends Component {
  async incrementDate() {
    await this.props.chooseDate(this.props.date + 24 * 60 * 60 * 1000);
    this.props.fetchMeals(this.props.date);
  }

  async decrementDate() {
    await this.props.chooseDate(this.props.date - 24 * 60 * 60 * 1000);
    this.props.fetchMeals(this.props.date);
  }

  renderDateChooser() {
    return (
      <ButtonToolbar align="center">
        <Button
          onClick={this.decrementDate.bind(this)}
          className="btn_header"
          bsStyle="primary"
        >
          Date--
        </Button>
        <Button
          onClick={this.incrementDate.bind(this)}
          className="btn_header"
          bsStyle="primary"
        >
          Date++
        </Button>
      </ButtonToolbar>
    );
  }
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
              {this.renderDateChooser()}
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

export default connect(mapsStateToProps, { chooseDate, fetchMeals })(Header);
