import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col,
  Glyphicon,
  ProgressBar
} from 'react-bootstrap';
import { setWater, setDefaultWaterTarget, fetchDefaultWaterTarget } from '../actions';

class DailyWater extends Component {

  async incWater(increment) {
    var newValue = this.props.water.desiliters + increment;
    if (newValue < 0) {
      newValue = 0;
    }
    await this.props.setWater(this.props.date, this.props.water.target, newValue);
  }

  async incDailyTarget(increment) {
    var newValue = this.props.water.target + increment;
    if (newValue < 0) {
      newValue = 0;
    }
    await this.props.setWater(this.props.date, newValue, this.props.water.desiliters);
  }

  async updateDailyTarget() {
    await this.props.setWater(this.props.date, this.props.water.defaultTarget, this.props.water.desiliters);
  }

  async incDefaultTarget(increment) {
    var newValue = this.props.water.defaultTarget + increment;
    if (newValue < 0) {
      newValue = 0;
    }
    this.props.setDefaultWaterTarget(newValue);
  }

  
  renderProgressBarRow() {
    if (this.props.water.target > 0) {
      return (
        <Row>
          <ProgressBar
            striped
            bsStyle="info"
            now={this.props.water.desiliters}
            max={this.props.water.target}
          />
        </Row>
      );
    }
  }

  renderButtonRow() {
    return (
      <Row>
        <Col xs={3} sm={1}>
          <Button
            disabled={this.props.water.desiliters <= 0}
            bsStyle="info"
            className="btn-water"
            onClick={this.incWater.bind(this, -5)}
          >
            <Glyphicon glyph="minus" />
          </Button>
        </Col>
        <Col xs={3} sm={1}>
          <Button
            disabled={this.props.water.desiliters <= 0}
            bsStyle="info"
            className="btn-water"
            onClick={this.incWater.bind(this, -1)}
          >
            -
          </Button>
        </Col>
        <Col xs={3} sm={1}>
          <Button
            bsStyle="info"
            className="btn-water"
            onClick={this.incWater.bind(this, 1)}
          >
            +
          </Button>
        </Col>
        <Col xs={3} sm={1}>
          <Button
            bsStyle="info"
            className="btn-water"
            onClick={this.incWater.bind(this, 5)}
          >
            <Glyphicon glyph="plus" />
          </Button>
        </Col>
      </Row>
    );
  }

  renderWater() {
    return (
      <Grid>
        {this.renderProgressBarRow()}
        {this.renderButtonRow()}
      </Grid>
    );
  }

  renderTargetSettings() {
    if (this.props.showTargetSettings) {
      return (
        <div>
          <h4>Water target settings</h4>
          <Grid>
            <Row>
              <Col xs={12}>
                <h5>
                  This day's target:{' '}
                  {(this.props.water.target / 10).toFixed(1)} liters
                </h5>
              </Col>

              <Col xs={12}>
                <Button
                  className="btn-sync-target"
                  onClick={this.updateDailyTarget.bind(this)}
                  disabled={
                    this.props.water.defaultTarget ===
                    this.props.water.target
                  }
                >
                  Update to default
                </Button>
              </Col>
              <Col xs={12}>
                <Button
                  className="btn-dec-target"
                  onClick={this.incDailyTarget.bind(this, -1)}
                  disabled={this.props.water.target <= 0}
                >
                  <Glyphicon glyph="minus" />
                </Button>
                <Button
                  className="btn-inc-target"
                  onClick={this.incDailyTarget.bind(this, 1)}
                >
                  <Glyphicon glyph="plus" />
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5>
                  Your default target:{' '}
                  {(this.props.water.defaultTarget / 10).toFixed(1)} liters
                </h5>
              </Col>
              <Col xs={12}>
                <Button
                  className="btn-dec-target"
                  onClick={this.incDefaultTarget.bind(this, -1)}
                  disabled={this.props.water.defaultTarget <= 0}
                >
                  <Glyphicon glyph="minus" />
                </Button>
                <Button
                  className="btn-inc-target"
                  onClick={this.incDefaultTarget.bind(this, 1)}
                >
                  <Glyphicon glyph="plus" />
                </Button>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <h4>
          Water: {(this.props.water.desiliters / 10).toFixed(1)} /{' '}
          {(this.props.water.target / 10).toFixed(1)} liters (daily
          target)
        </h4>
        {this.renderWater()}
        {this.renderTargetSettings()}
      </div>
    );
  }
}

function mapsStateToProps({ date, water }) {
  return { date, water };
}

export default connect(mapsStateToProps, { setWater, setDefaultWaterTarget, fetchDefaultWaterTarget })(DailyWater);
