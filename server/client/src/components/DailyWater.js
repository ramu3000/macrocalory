import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { setWater } from '../actions';

class DailyWater extends Component {
  async addDesiLiter() {
    await this.props.setWater(this.props.date, this.props.water + 1);
  }

  async subDesiLiter() {
    await this.props.setWater(this.props.date, this.props.water - 1);
  }

  render() {
    return (
      <div>
        <h4>Water: {(this.props.water / 10).toFixed(1)} liters today</h4>
        <Button
          disabled={this.props.water <= 0}
          bsStyle="info"
          className="water"
          onClick={this.subDesiLiter.bind(this)}
        >
          -
        </Button>
        <Button
          bsStyle="info"
          className="water"
          onClick={this.addDesiLiter.bind(this)}
        >
          +
        </Button>
      </div>
    );
  }
}

function mapsStateToProps({ date, water }) {
  return { date, water };
}

export default connect(mapsStateToProps, { setWater })(DailyWater);
