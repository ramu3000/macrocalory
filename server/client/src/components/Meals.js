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
    return <h3>{dateString}</h3>;
  }

  renderIngredientRow(ingredient) {
    return (
      <Row key={ingredient._id}>
        <Col xs={2} />
        <Col xs={7}>{ingredient.name}</Col>
        <Col xs={3}>{ingredient.mass}g</Col>
      </Row>
    );
  }
  renderMealPanel(meal) {
    const timeStr = moment(meal.date).format('HH:mm');
    return (
      <Panel fluid key={meal._id} bsStyle="success">
        <Panel.Heading>
          <Row key={meal._id}>
            <Col xs={2}>{timeStr}</Col>
            <Panel.Toggle>
              <Col xs={7}>{meal.name}</Col>
            </Panel.Toggle>
            <Col xs={1}>
              <Button
                className="btn-meal-list"
                bsStyle="success"
                bsSize="xsmall"
                onClick={() => this.editMeal(meal)}
              >
                Edit
              </Button>
            </Col>
            <Col align="center" xs={2}>
              <Button
                className="btn-meal-list"
                bsStyle="danger"
                bsSize="xsmall"
                onClick={() => this.deleteMeal(meal)}
              >
                Delete
              </Button>
            </Col>
          </Row>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            {_.map(_.sortBy(meal.ingredients, ['name']), ingredient => {
              return this.renderIngredientRow(ingredient);
            })}
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }

  renderMeals() {
    return (
      <div>
        <h4>Meals: {this.props.meals.length} meals today</h4>
        <Grid fluid>
          {_.map(_.sortBy(this.props.meals, ['date']), meal => {
            return this.renderMealPanel(meal);
          })}
          <Panel fluid bsStyle="success">
            <Panel.Heading>
              <Row>
                <Col align="center" xsOffset={10} xs={2}>
                  <Link className="btn btn-success btn-xs" to="/meals/new">
                    Add meal
                  </Link>
                </Col>
              </Row>
            </Panel.Heading>
          </Panel>
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
