import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Panel, Grid, Row, Col, Button } from 'react-bootstrap';
import _ from 'lodash';
import DailyWater from './DailyWater';
import { Link } from 'react-router-dom';
import { fetchMeals, fetchDailyWater } from '../actions';

class Dashboard extends Component {
  componentDidMount() {
    this.props.fetchMeals(this.props.date);
    this.props.fetchDailyWater(this.props.date);
  }
  editMeal(meal) {
    // Call action to edit meal - sets 'current_meal', redirects to edit view?
    console.log('TODO: Editing meal with id ' + meal._id);
  }

  deleteMeal(meal) {
    // Call action to make API-request to delete this meal
    // If successful, either remove meal from props or fetch daily meals anew
    console.log('TODO: Deleting meal with id ' + meal._id);
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
        <h3>{this.props.meals.count} meals on this day</h3>
        <Grid>
          {_.map(this.props.meals.meals, meal => {
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
          <Link className="btn btn-primary" to="/food/new">
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

export default connect(mapsStateToProps, { fetchMeals, fetchDailyWater })(
  Dashboard
);
