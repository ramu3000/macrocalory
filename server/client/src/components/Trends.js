import React, { Component } from 'react';
import connect from 'react-redux/lib/connect/connect';
import { Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { clearTrendsData, fetchTrendsWater } from '../actions';
import _ from 'lodash';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';

class Trends extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      startDate: new Date('2018-03-15T00:00:00'),
      endDate: new Date(),
      value: []
    };
  }

  componentWillMount() {
    this.props.clearTrendsData();
  }

  handleChange(e) {
    this.setState({ value: e });
  }

  updateTrendsData() {
    // TODO: This must be changed quite a bit (and actions and reducers also)
    // - Now we get
    // -- All the water data (without start and end dates)
    // --- (We filter dates when handling the data! - Water API does not support interval!)
    // -- Nothing but the water data
    if (this.state.value.length !== 0) {
      this.props.fetchTrendsWater();
    }
  }

  renderChart() {
    if (this.props.trends.water.length === 0) {
      return null;
    }
    var data = [];

    const waters = this.props.trends.water;

    _.map(_.sortBy(waters, '[date]'), water => {
      data.push({ name: water.date, desiliters: water.desiliters });
    });
    return (
      <ResponsiveContainer width="100%" aspect={2}>
        <LineChart
          data={data}
          margin={{ top: 50, right: 50, left: 0, bottom: 50 }}
        >
          <Line type="monotone" dataKey="desiliters" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis dataKey="desiliters" />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  renderFetchControls() {
    return (
      <div>
        <ToggleButtonGroup
          type="checkbox"
          value={this.state.value}
          onChange={this.handleChange}
        >
          <ToggleButton value="protein" disabled>
            Protein
          </ToggleButton>
          <ToggleButton value="carbohydrate" disabled>
            Carbohydrate
          </ToggleButton>
          <ToggleButton value="fat" disabled>
            Fat
          </ToggleButton>
          <ToggleButton value="energy" disabled>
            Energy
          </ToggleButton>
          <ToggleButton value="water">Water</ToggleButton>
        </ToggleButtonGroup>
        <Button
          bsStyle="primary"
          onClick={this.updateTrendsData.bind(this)}
          disabled={this.state.value.length === 0}
        >
          GO!
        </Button>
      </div>
    );
  }
  render() {
    return (
      <div>
        <div>{this.renderFetchControls()}</div>
        <div align="center">{this.renderChart()}</div>
      </div>
    );
  }
}

function mapStateToProps({ trends }) {
  return { trends };
}
export default connect(mapStateToProps, { clearTrendsData, fetchTrendsWater })(
  Trends
);
