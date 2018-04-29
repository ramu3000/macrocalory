import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Panel,
  Grid,
  Row,
  Col,
  Button,
  ButtonToolbar,
  Popover,
  OverlayTrigger
} from 'react-bootstrap';
import _ from 'lodash';
import DailyWater from './DailyWater';
import { Link } from 'react-router-dom';
import {
  fetchDailyMeals,
  fetchDailyWater,
  deleteMeal,
  chooseDate
} from '../actions';
import { Calendar } from 'react-date-range';
import '../css/meals.css';

class Meals extends Component {
  componentDidMount() {
    this.props.fetchDailyMeals(this.props.date);
    this.props.fetchDailyWater(this.props.date);
  }
  async chooseDate(date) {
    // When typing on date picker bar, it generates undefined values
    if (!(date === undefined)) {
      await this.props.chooseDate(date);
      await this.props.fetchDailyMeals(this.props.date);
      await this.props.fetchDailyWater(this.props.date);
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
  editMeal(meal) {
    this.props.history.push(`meals/edit/${meal._id}`);
  }

  async deleteMeal(meal) {
    await this.props.deleteMeal(meal._id);
    await this.props.fetchDailyMeals(this.props.date);
  }

  datepickerOverlay(onChange) {
    return (
      <Popover id="calendar" title="Choose a date">
        <Calendar onChange={onChange} />
      </Popover>
    );
  }

  renderDateAndControls() {
    const dateString = 'My Meals: ' + moment(this.props.date).format('ddd, DD of MMM YYYY');

    return (
      <Grid>
        <h3>{dateString}</h3>
        <ButtonToolbar>
          <Button
            bsSize="small"
            onClick={this.decrementDate.bind(this)}
            className="btn-meals-date"
          >
            -
          </Button>
          <Button
            bsSize="small"
            onClick={this.incrementDate.bind(this)}
            className="btn-meals-date"
          >
            +
          </Button>

          <OverlayTrigger
            trigger={['click']}
            placement="bottom"
            overlay={this.datepickerOverlay(this.chooseDate.bind(this))}
          >
            <Button bsSize="small">Choose date</Button>
          </OverlayTrigger>
        </ButtonToolbar>
      </Grid>
    );
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
      <Panel key={meal._id} bsStyle="success">
        <Panel.Heading>
          <Row key={meal._id}>
            <Col xs={2}>{timeStr}</Col>
            <Panel.Toggle>
              <Col xs={6}>{meal.name}</Col>
            </Panel.Toggle>
            <Col xs={4} align="right">
              <Button
                className="btn-meal-list"
                bsStyle="success"
                bsSize="xsmall"
                onClick={() => this.editMeal(meal)}
              >
                Edit
              </Button>
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
      <Grid>
        <h4>Meals: {this.props.meals.length} meals today</h4>
        <Grid>
          {_.map(_.sortBy(this.props.meals, ['date']), meal => {
            return this.renderMealPanel(meal);
          })}
          <Link to="/meals/new">
            <Panel bsStyle="success">
              <Panel.Heading>
                <Panel.Title componentClass="h1" align="center">
                  Click here to add new meal!
                </Panel.Title>
              </Panel.Heading>
            </Panel>
          </Link>
        </Grid>
      </Grid>
    );
  }

  renderWater() {
    return (
      <Grid>
        <DailyWater />
      </Grid>
    );
  }

  render() {
    return (
      <Grid>
        {this.renderDateAndControls()}
        {this.renderMeals()}
        {this.renderWater()}
      </Grid>
    );
  }
}

function mapsStateToProps({ meals, date }) {
  return { meals, date };
}

export default connect(mapsStateToProps, {
  chooseDate,
  fetchDailyMeals,
  fetchDailyWater,
  deleteMeal
})(Meals);
