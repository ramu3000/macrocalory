import React, { Component } from 'react';
import connect from 'react-redux/lib/connect/connect';
import { Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { clearTrendsData, fetchTrendsWater } from '../actions';
import _ from 'lodash';
import MIterator from 'moment-iterator';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';

const WATER = 'water';
const CARBOHYDRATE = 'carbohydrate';
const PROTEIN = 'protein';
const FAT = 'fat';
const ENERGY = 'energy';

class Trends extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      startDate: new Date('2018-01-15T00:00:00'),
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
    // 1. WATER
    // - TODO: This must be changed quite a bit (and actions and reducers also)
    // - Now we get
    // -- All the water data (without start and end dates)
    // --- (We filter dates when handling the data! - Water API does not support interval!)
    // -- Nothing but the water data
    if (
      this.state.value.find(e => {
        return e === WATER;
      })
    ) {
      this.props.fetchTrendsWater();
    }
  }

  buildWaterChartData(waters) {
    // API returns us only non-zero-dates, we must add zero-data
    // to dates with no record.

    // First creating zero-data -array for each date
    var data = [];
    const start = this.state.startDate;
    const end = this.state.endDate;
    MIterator(start, end).each('days', day => {
      const str = day.format('YYYY-MM-DD');
      data.push({ dateStr: str, desiliters: 0 });
    });

    // Then populating with existing data
    _.map(data, zeroRecord => {
      // If waters contain this date, set the desiliters value
      const existingRecord = _.find(waters, record => {
        return record.date === zeroRecord.dateStr;
      });
      if (existingRecord) {
        zeroRecord.desiliters = existingRecord.desiliters;
      }
    });
    return data;
  }

  renderCharts() {
    if (this.props.trends.water !== undefined) {
      const waterChartData = this.buildWaterChartData(this.props.trends.water);
      return (
        <ResponsiveContainer width="100%" aspect={2}>
          <LineChart
            data={waterChartData}
            margin={{ top: 50, right: 50, left: 0, bottom: 50 }}
          >
            <Line type="monotone" dataKey="desiliters" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="dateStr" />
            <YAxis dataKey="desiliters" />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  }

  renderFetchControls() {
    return (
      <div>
        <ToggleButtonGroup
          type="checkbox"
          value={this.state.value}
          onChange={this.handleChange}
        >
          <ToggleButton value={PROTEIN} disabled>
            Protein
          </ToggleButton>
          <ToggleButton value={CARBOHYDRATE} disabled>
            Carbohydrate
          </ToggleButton>
          <ToggleButton value={FAT} disabled>
            Fat
          </ToggleButton>
          <ToggleButton value={ENERGY} disabled>
            Energy
          </ToggleButton>
          <ToggleButton value={WATER}>Water</ToggleButton>
        </ToggleButtonGroup>
        <Button
          bsStyle="primary"
          onClick={this.updateTrendsData.bind(this)}
          // disabled={this.state.value.length === 0}
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
        <div> {this.renderCharts()}</div>
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
