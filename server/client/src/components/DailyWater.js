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
import { setWater } from '../actions';

class DailyWater extends Component {
  constructor(props) {
    super(props);

    this.state = {
      TODO_dailyWaterGoal: 10,
      TODO_currentWaterGoal: 20,
      TODO_newCurrentWaterGoal: 20
    };
  }

  async incWater(increment) {
    var newValue = this.props.water + increment;
    if (newValue < 0) {
      newValue = 0;
    }
    await this.props.setWater(this.props.date, newValue);
  }

  async incCurrentTarget(increment) {
    var newValue = this.state.TODO_currentWaterGoal + increment;
    if (newValue < 0) {
      newValue = 0;
    }
    this.setState({ TODO_currentWaterGoal: newValue });
  }

  async updateDailyTarget() {
    this.setState({ TODO_dailyWaterGoal: this.state.TODO_currentWaterGoal });
  }

  renderProgressBarRow() {
    if (this.state.TODO_dailyWaterGoal > 0) {
      return (
        <Row>
          <ProgressBar
            striped
            bsStyle="info"
            now={this.props.water}
            max={this.state.TODO_dailyWaterGoal}
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
            disabled={this.props.water <= 0}
            bsStyle="info"
            className="btn-water"
            onClick={this.incWater.bind(this, -5)}
          >
            <Glyphicon glyph="minus" />
          </Button>
        </Col>
        <Col xs={3} sm={1}>
          <Button
            disabled={this.props.water <= 0}
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
                  {(this.state.TODO_dailyWaterGoal / 10).toFixed(1)} liters
                </h5>
              </Col>

              <Col xs={12}>
                <Button
                  className="btn-sync-target"
                  onClick={this.updateDailyTarget.bind(this)}
                  disabled={
                    this.state.TODO_currentWaterGoal ===
                    this.state.TODO_dailyWaterGoal
                  }
                >
                  Update to current
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5>
                  Your current default target:{' '}
                  {(this.state.TODO_currentWaterGoal / 10).toFixed(1)} liters
                </h5>
              </Col>
              <Col xs={12}>
                <Button
                  className="btn-dec-target"
                  onClick={this.incCurrentTarget.bind(this, -1)}
                  disabled={this.TODO_currentWaterGoal <= 0}
                >
                  <Glyphicon glyph="minus" />
                </Button>
                <Button
                  className="btn-inc-target"
                  onClick={this.incCurrentTarget.bind(this, 1)}
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
          Water: {(this.props.water / 10).toFixed(1)} /{' '}
          {(this.state.TODO_dailyWaterGoal / 10).toFixed(1)} liters (daily
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

export default connect(mapsStateToProps, { setWater })(DailyWater);
