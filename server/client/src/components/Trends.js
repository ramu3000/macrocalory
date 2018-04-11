import React, { Component } from 'react';
import connect from 'react-redux/lib/connect/connect';
import { Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { clearTrendsData, fetchTrendsWater } from '../actions';

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
    return <div>{this.renderFetchControls()}</div>;
  }
}

function mapStateToProps({ trends }) {
  return { trends };
}
export default connect(mapStateToProps, { clearTrendsData, fetchTrendsWater })(
  Trends
);
