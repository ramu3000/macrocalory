import React, { Component } from 'react';
import connect from 'react-redux/lib/connect/connect';
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  OverlayTrigger,
  Popover,
  Glyphicon
} from 'react-bootstrap';
import {
  clearTrendsData,
  fetchTrendsWater,
  fetchTrendsMeals
} from '../actions';
import _ from 'lodash';
import moment from 'moment';
import MIterator from 'moment-iterator';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { DateRange } from 'react-date-range';
import '../css/trends.css';

const WATER = 'water';
const MACRO = 'macronutrients';
const ENERGY = 'energy';

class Trends extends Component {
  constructor(props) {
    super(props);

    this.handleToggles = this.handleToggles.bind(this);

    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      gotData: false,
      toggles: []
    };
  }

  componentWillMount() {
    this.props.clearTrendsData();
  }

  handleToggles(e) {
    this.setState({ toggles: e });
  }

  fetchTrendsData() {
    // Let's make it simple here. We fetch both water and meals data to
    // be able to show everything the user chooses after fetching.
    // The data is cleared when user changes the date range and must be
    // fetched again.

    const after = moment(this.state.startDate)
      .startOf('day')
      .toDate();
    const before = moment(this.state.endDate)
      .endOf('day')
      .toDate();
    this.props.fetchTrendsMeals(after, before);

    // Ok, we are a little bit restricted by our backend API now.
    // We can only get ALL water data for our user (without start and end dates)
    // AND this data does not contain zero-water-dates
    this.props.fetchTrendsWater();

    this.setState({ gotData: true });
  }

  buildChartData(meals, waters) {
    // We combine all the data to common chart data which could be used
    // to render single chart with individual lines. In reality, we render
    // a couple of charts because we need different units for many of the
    // lines.

    // First creating zero-data -array for each date in date range
    var data = [];
    const start = this.state.startDate;
    const end = this.state.endDate;
    MIterator(start, end).each('days', day => {
      data.push({
        date: day.format('YYYY-MM-DD'),
        datePresentation: day.format('DD.MM'),
        protein: 0,
        carbohydrate: 0,
        fat: 0,
        energy: 0,
        water: 0
      });
    });

    // 1. Energy and macronutrients from fetched meals

    // for each meal in fetched meals data
    _.map(meals, meal => {
      // We find the correct daily object from chart data array
      const mealDate = moment(meal.date).format('YYYY-MM-DD');
      const dailyValues = _.find(data, record => {
        return record.date === mealDate;
      });

      if (dailyValues) {
        // for each ingredient
        _.map(meal.ingredients, ingredient => {
          // We calculate sum values from unit values and mass and add
          // them to chart data object
          const factor = ingredient.mass / 100;
          dailyValues.protein += ingredient.protein * factor;
          dailyValues.carbohydrate += ingredient.carbohydrate * factor;
          dailyValues.fat += ingredient.fat * factor;
          dailyValues.energy += ingredient.kcal * factor;
        });
      }
    });

    // 2. Water from fetched daily waters

    // API returns us only non-zero-dates, so we do this differently
    // from above energy and macro -stuff

    // for each daily record in chart data array
    _.map(data, zeroWater => {
      // If fetched daily waters contain this date, set the chart data value
      const existingRecord = _.find(waters, record => {
        return record.date === zeroWater.date;
      });
      if (existingRecord) {
        zeroWater.water = existingRecord.desiliters;
      }
    });

    return data;
  }

  renderEnergyChart(chartData) {
    // Energy is in its own chart because it has unit of kcal. The chart is
    // shown only if ENERGY is activated.
    if (
      this.state.toggles.find(e => {
        return e === ENERGY;
      })
    ) {
      return (
        <ResponsiveContainer width="100%" aspect={3}>
          <LineChart
            data={chartData}
            margin={{ top: 50, right: 50, left: 0, bottom: 50 }}
          >
            <Line name="Energy (kcal)" type="monotone" dataKey="energy" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="datePresentation" />
            <YAxis dataKey="energy" />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  }

  renderMacronutrientChart(chartData) {
    // Macronutrients are in their own chart because they have unit of grams.
    // The chart is shown only if MACRO is activated
    if (
      this.state.toggles.find(e => {
        return e === MACRO;
      })
    ) {
      return (
        <ResponsiveContainer width="100%" aspect={3}>
          <LineChart
            data={chartData}
            margin={{ top: 50, right: 50, left: 0, bottom: 50 }}
          >
            <Line
              name="Protein (g)"
              type="monotone"
              dataKey="protein"
              stroke="#669900"
            />
            <Line
              name="Carbohydrate (g)"
              type="monotone"
              dataKey="carbohydrate"
              stroke="#0066ff"
            />
            <Line
              name="Fat (g)"
              type="monotone"
              dataKey="fat"
              stroke="#ff0000"
            />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="datePresentation" />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  }

  renderWaterChart(chartData) {
    // Water is in its own chart because it has unit of desiliter. The chart
    // is shown only if WATER is activated
    if (
      this.state.toggles.find(e => {
        return e === WATER;
      })
    ) {
      return (
        <ResponsiveContainer width="100%" aspect={3}>
          <LineChart
            data={chartData}
            margin={{ top: 50, right: 50, left: 0, bottom: 50 }}
          >
            <Line name="Water (dl)" type="monotone" dataKey="water" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="datePresentation" />
            <YAxis dataKey="water" />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  }

  handleSelect(range) {
    this.props.clearTrendsData();
    this.setState({ gotData: false });
    this.setState({ startDate: range.startDate.toDate() });
    this.setState({ endDate: range.endDate.toDate() });
  }

  datepickerOverlay(onChange) {
    return (
      <Popover id="calendar" title="Choose date range">
        <DateRange onInit={onChange} onChange={onChange} />
      </Popover>
    );
  }

  validDateRange() {
    return (
      this.state.startDate &&
      this.state.endDate &&
      !moment(this.state.startDate).isSame(moment(this.state.endDate), 'day')
    );
  }

  renderDateRangeButton() {
    return (
      <OverlayTrigger
        trigger={['click']}
        placement="bottom"
        overlay={this.datepickerOverlay(this.handleSelect.bind(this))}
      >
        <Button className="btn-set-range">
          <Glyphicon glyph="calendar" />
        </Button>
      </OverlayTrigger>
    );
  }

  loadButtonPopover(text) {
    if (text === null) {
      return;
    } else {
      return <Popover id="loadButton">{text}</Popover>;
    }
  }
  renderLoadButton() {
    // This is ugly, but popover was very hard to get working as intended,
    // so we handle this active button -case separately (without OverlayTrigger)
    // which finally fixes most of the problems.
    if (!this.state.gotData && this.validDateRange()) {
      return (
        <Button
          className="btn-load-data"
          bsStyle="primary"
          onClick={this.fetchTrendsData.bind(this)}
        >
          <Glyphicon glyph="download" />
        </Button>
      );
    } else {
      // And here, the Popover barely works... we need additional <span> to
      // wrap the button. The clicking has to happen in quite center of the
      // button for this to work.
      var glyphStr = '';
      var loadTooltipTxt = '';
      if (this.state.gotData) {
        glyphStr = 'ok';
        loadTooltipTxt = 'Data is already loaded for given date range.';
      } else {
        glyphStr = 'download';
        loadTooltipTxt = 'You must choose date range first.';
      }
      return (
        <OverlayTrigger
          trigger={['click']}
          rootClose
          placement="bottom"
          overlay={<Popover id="loadButton">{loadTooltipTxt}</Popover>}
        >
          <span>
            <Button
              className="btn-load-data"
              bsStyle="primary"
              onClick={this.fetchTrendsData.bind(this)}
              disabled
            >
              <Glyphicon glyph={glyphStr} />
            </Button>
          </span>
        </OverlayTrigger>
      );
    }
  }

  renderDateAndControls() {
    var header = 'My Trends: ';
    if (this.validDateRange()) {
      header +=
        moment(this.state.startDate).format('DD.MM.YYYY') +
        ' - ' +
        moment(this.state.endDate).format('DD.MM.YYYY');
    } else {
      header += 'Range not set';
    }

    return (
      <Grid>
        <h3>{header}</h3>
        {this.renderDateRangeButton()}
        {this.renderLoadButton()}
      </Grid>
    );
  }

  renderChartToggles() {
    return (
      <Grid>
        <h4>Charts to show</h4>
        <ToggleButtonGroup
          justified
          bsSize="xsmall"
          type="checkbox"
          value={this.state.toggles}
          onChange={this.handleToggles}
          className="btn-chart-toggle"
        >
          <ToggleButton value={ENERGY}>Energy</ToggleButton>
          <ToggleButton value={MACRO}>Macros</ToggleButton>
          <ToggleButton value={WATER}>Water</ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    );
  }

  renderCharts() {
    // To make it simple here, we must have fetched data to render charts
    if (this.props.trends.meals && this.props.trends.waters) {
      const chartData = this.buildChartData(
        this.props.trends.meals,
        this.props.trends.waters
      );
      return (
        <div>
          {this.renderEnergyChart(chartData)}
          {this.renderMacronutrientChart(chartData)}
          {this.renderWaterChart(chartData)}
        </div>
      );
    }
  }

  render() {
    return (
      <Grid>
        {this.renderDateAndControls()}
        {this.renderChartToggles()}
        {this.renderCharts()}
      </Grid>
    );
  }
}

function mapStateToProps({ trends }) {
  return { trends };
}
export default connect(mapStateToProps, {
  clearTrendsData,
  fetchTrendsWater,
  fetchTrendsMeals
})(Trends);
