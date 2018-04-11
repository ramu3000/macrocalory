import React, { Component } from 'react';
import connect from 'react-redux/lib/connect/connect';
import { Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

class TrendsSettingsGroup extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      startDate: new Date('2018-03-15T00:00:00'),
      endDate: new Date(),
      value: []
    };
  }

  handleChange(e) {
    this.setState({ value: e });
  }

  createTrends() {
    if (this.state.value.length === 0) {
      return null;
    }
  }

  render() {
    return (
      <div>
        <ToggleButtonGroup
          type="checkbox"
          value={this.state.value}
          onChange={this.handleChange}
        >
          <ToggleButton value="protein">Protein</ToggleButton>
          <ToggleButton value="carbohydrate">Carbohydrate</ToggleButton>
          <ToggleButton value="fat">Fat</ToggleButton>
          <ToggleButton value="energy">Energy</ToggleButton>
          <ToggleButton value="water">Water</ToggleButton>
        </ToggleButtonGroup>
        <Button
          bsStyle="primary"
          onClick={this.createTrends.bind(this)}
          disabled={this.state.value.length === 0}
        >
          GO!
        </Button>
      </div>
    );
  }
}

class Trends extends Component {
  render() {
    return (
      <div>
        <TrendsSettingsGroup />
      </div>
    );
  }
}

export default connect(null, null)(Trends);
