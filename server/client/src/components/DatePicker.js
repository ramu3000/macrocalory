import React, { Component } from 'react';
import { connect } from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { chooseDate, fetchMeals } from '../actions';

class DatePicker extends Component {
  async chooseDate(date) {
    // When typing on date picker bar, it generates undefined values
    if (!(date === undefined)) {
      await this.props.chooseDate(date);
      this.props.fetchMeals(this.props.date);
    }
  }

  async incrementDate() {
    await this.chooseDate(
      moment(this.props.date)
        .add({ days: 1 })
        .toDate()
    );
  }

  async decrementDate() {
    await this.chooseDate(
      moment(this.props.date)
        .add({ days: -1 })
        .toDate()
    );
  }

  render() {
    const dateStr = this.props.date
      ? moment(this.props.date).format('YYYY-MM-DD')
      : '';
    return (
      <div>
        <Button onClick={this.decrementDate.bind(this)} className="datepicker">
          -
        </Button>
        <DayPickerInput
          value={dateStr}
          onDayChange={this.chooseDate.bind(this)}
        />
        <Button onClick={this.incrementDate.bind(this)} className="datepicker">
          +
        </Button>
      </div>
    );
  }
}

function mapsStateToProps({ date }) {
  return { date };
}

export default connect(mapsStateToProps, { chooseDate, fetchMeals })(
  DatePicker
);
