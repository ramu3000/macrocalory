import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Panel, Grid, Row, Col, Button } from 'react-bootstrap';
import _ from 'lodash';
import DailyWater from './DailyWater';
import { Link } from 'react-router-dom';
import { fetchDailyMeals, fetchDailyWater, deleteMeal } from '../actions';

class Meals extends Component {
  componentDidMount() {
    this.props.fetchDailyMeals(this.props.date);
    this.props.fetchDailyWater(this.props.date);
  }
  editMeal(meal) {
    // Call action to edit meal - sets 'current_meal', redirects to edit view?
    console.log('TODO: Editing meal with id ' + meal._id);
  }

  async deleteMeal(meal) {
    await this.props.deleteMeal(meal._id);
    await this.props.fetchDailyMeals(this.props.date);
  }

  renderDate() {
    const dateString = moment(this.props.date).format('ddd, DD of MMM YYYY');
    return <h2>{dateString}</h2>;
  }

  renderMealRow(meal) {
    const timeStr = moment(meal.date).format('HH:mm:ss');
    return (
      <Row className="meal-panel">
        <Col lg={2} sm={2} md={2} xs={2}>
          {timeStr}
        </Col>
        <Col lg={2} sm={2} md={2} xs={2}>
          {meal.name}
        </Col>
        <Col lg={4} sm={4} md={4} xs={4}>
          <Panel bsStyle="danger">EMPTY FILLER COLUMN</Panel>
        </Col>
        <Col lg={2} sm={2} md={2} xs={2}>
          <Button onClick={() => this.editMeal(meal)}>Edit</Button>
        </Col>
        <Col lg={2} sm={2} md={2} xs={2}>
          <Button onClick={() => this.deleteMeal(meal)}>Delete</Button>
        </Col>
      </Row>
    );
  }

  renderMeals() {
    return (
      <div>
        <h3>{this.props.meals.length} meals on this day</h3>
        <Grid>
          {_.map(_.sortBy(this.props.meals, ['date']), meal => {
            return <Panel key={meal._id}>{this.renderMealRow(meal)}</Panel>;
          })}
        </Grid>
      </div>
    );
  }

  renderWater() {
    return (
      <div>
        <DailyWater />
      </div>
    );
  }

  render() {
    return (
      <div>
        <div>
          <Link className="btn btn-primary" to="/meals/new">
            Add meal
          </Link>
        </div>
        {this.renderDate()}
        {this.renderMeals()}
        {this.renderWater()}
      </div>
    );
  }
}

function mapsStateToProps({ meals, date }) {
  return { meals, date };
}

export default connect(mapsStateToProps, {
  fetchDailyMeals,
  fetchDailyWater,
  deleteMeal
})(Meals);
