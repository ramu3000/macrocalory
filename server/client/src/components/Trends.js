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
import { Panel } from 'react-bootstrap';
import { DateRange } from 'react-date-range';

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
      startDate: new Date('2018-02-25T00:00:00'),
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
    // Ok, we are a little bit restricted by our backend API now.
    // We can only get ALL water data for our user (without start and end dates)
    // This data does not contain zero-water-dates
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
    //TODO: Here somehow render  conditionally different lines
    if (
      this.props.trends.water !== undefined &&
      this.state.value.find(e => {
        return e === WATER;
      })
    ) {
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

  handleSelect(range) {
    this.props.clearTrendsData();
    this.setState({ startDate: range.startDate.toDate() });
    this.setState({ endDate: range.endDate.toDate() });
  }

  renderFetchControls() {
    return (
      <Panel>
        <Panel.Heading>
          <ToggleButtonGroup
            vertical
            bsSize="xsmall"
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
            disabled={this.state.value.length === 0}
          >
            GO!
          </Button>
          <Panel.Toggle>Choose date range</Panel.Toggle>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <DateRange
              onInit={this.handleSelect.bind(this)}
              onChange={this.handleSelect.bind(this)}
            />
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }

  render() {
    return (
      <div>
        <div>{this.renderFetchControls()}</div>
        <div>{this.renderCharts()}</div>
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
