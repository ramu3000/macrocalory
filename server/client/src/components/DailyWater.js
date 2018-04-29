import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Row, Col, Glyphicon } from 'react-bootstrap';
import { setWater } from '../actions';

class DailyWater extends Component {
  async addDesiLiter() {
    await this.props.setWater(this.props.date, this.props.water + 1);
  }

  async subDesiLiter() {
    await this.props.setWater(
      this.props.date,
      this.props.water >= 1 ? this.props.water - 1 : 0
    );
  }
  async addLiter() {
    await this.props.setWater(this.props.date, this.props.water + 10);
  }

  async subLiter() {
    await this.props.setWater(
      this.props.date,
      this.props.water >= 10 ? this.props.water - 10 : 0
    );
  }

  render() {
    return (
      <div>
        <h4>Water: {(this.props.water / 10).toFixed(1)} liters today</h4>
        <Grid>
          <Row>
            <Col xs={2} sm={1}>
              <Button
                disabled={this.props.water <= 0}
                bsStyle="info"
                className="btn-water"
                onClick={this.subLiter.bind(this)}
              >
                <Glyphicon glyph="minus"/>
              </Button>
            </Col>
            <Col xs={2} sm={1}>
              <Button
                disabled={this.props.water <= 0}
                bsStyle="info"
                className="btn-water"
                onClick={this.subDesiLiter.bind(this)}
              >
                -
              </Button>
            </Col>
            <Col xs={2} sm={1}>
              <Button
                bsStyle="info"
                className="btn-water"
                onClick={this.addDesiLiter.bind(this)}
              >
                +
              </Button>
            </Col>
            <Col xs={2} sm={1}>
              <Button
                bsStyle="info"
                className="btn-water"
                onClick={this.addLiter.bind(this)}
              >
                <Glyphicon glyph="plus"/>
              </Button>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

function mapsStateToProps({ date, water }) {
  return { date, water };
}

export default connect(mapsStateToProps, { setWater })(DailyWater);
