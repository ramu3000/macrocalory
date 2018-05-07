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
  OverlayTrigger,
  Glyphicon
} from 'react-bootstrap';
import _ from 'lodash';
import DailyWater from './DailyWater';
import { Link } from 'react-router-dom';
import {
  fetchDailyMeals,
  fetchDailyWater,
  fetchDefaultWaterTarget,
  deleteMeal,
  chooseDate
} from '../actions';
import { Calendar } from 'react-date-range';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import '../css/meals.css';

const NUM_OF_DECIMALS = 1;

class Meals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMore: false
    };
  }

  componentDidMount() {
    this.props.fetchDailyMeals(this.props.date);
    this.props.fetchDailyWater(this.props.date);
    this.props.fetchDefaultWaterTarget();
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

  toggleShowMore() {
    this.setState({ showMore: !this.state.showMore });
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
    const dateString =
      'My Meals: ' + moment(this.props.date).format('ddd, DD of MMM YYYY');

    return (
      <Grid>
        <h3>{dateString}</h3>
        <ButtonToolbar>
          <Button
            bsSize="small"
            onClick={this.decrementDate.bind(this)}
            className="btn-meals-date"
          >
            <Glyphicon glyph="chevron-left" />
          </Button>
          <Button
            bsSize="small"
            onClick={this.incrementDate.bind(this)}
            className="btn-meals-date"
          >
            <Glyphicon glyph="chevron-right" />
          </Button>

          <OverlayTrigger
            trigger={['click']}
            placement="bottom"
            overlay={this.datepickerOverlay(this.chooseDate.bind(this))}
          >
            <Button bsSize="small" className="btn-calendar">
              <Glyphicon glyph="calendar" />
            </Button>
          </OverlayTrigger>
          <Button
            bsSize="small"
            onClick={this.toggleShowMore.bind(this)}
            className="btn-show-more"
          >
            <Glyphicon glyph="edit" />
          </Button>
        </ButtonToolbar>
      </Grid>
    );
  }

  renderIngredientRow(ingredient) {
    return (
      <Row key={ingredient._id}>
        <Col className="col-ingredient" xs={9} sm={4}>
          {ingredient.name}
        </Col>
        <Col className="col-mass" xs={3} sm={3}>
          {ingredient.mass.toFixed(NUM_OF_DECIMALS)}g
        </Col>
        <Col className="col-ch" xs={3} sm={1}>
          {(ingredient.carbohydrate * ingredient.mass / 100).toFixed(
            NUM_OF_DECIMALS
          )}g
        </Col>
        <Col className="col-fat" xs={3} sm={1}>
          {(ingredient.fat * ingredient.mass / 100).toFixed(NUM_OF_DECIMALS)}g
        </Col>
        <Col className="col-protein" xs={3} sm={1}>
          {(ingredient.protein * ingredient.mass / 100).toFixed(
            NUM_OF_DECIMALS
          )}g
        </Col>
        <Col className="col-kcal" xs={3} sm={2}>
          {(ingredient.kcal * ingredient.mass / 100).toFixed(NUM_OF_DECIMALS)}kcal
        </Col>
      </Row>
    );
  }

  renderMacroPieChart(meal) {
    var carbohydrate = 0;
    var fat = 0;
    var protein = 0;
    _.map(meal.ingredients, ingredient => {
      carbohydrate += ingredient.carbohydrate * ingredient.mass / 100;
      fat += ingredient.fat * ingredient.mass / 100;
      protein += ingredient.protein * ingredient.mass / 100;
    });
    const data = [
      { name: 'Carbohydrate', value: Math.round(carbohydrate * 10) / 10 },
      { name: 'Fat', value: Math.round(fat * 10) / 10 },
      { name: 'Protein', value: Math.round(protein * 10) / 10 }
    ];
    const colors = ['#0066ff', '#ff0000', '#669900'];

    return (
      <PieChart width={320} height={200}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={60}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    );
  }

  renderMealPanel(meal) {
    const timeStr = moment(meal.date).format('HH:mm');
    var energy = 0;
    _.map(meal.ingredients, ingredient => {
      energy += ingredient.kcal * ingredient.mass / 100;
    });
    return (
      <Panel key={meal._id} bsStyle="success">
        <Panel.Heading key={meal._id}>
          <Row key={meal._id}>
            <Col xs={2}>{timeStr}</Col>
            <Panel.Toggle>
              <Col xs={4}>{meal.name}</Col>
            </Panel.Toggle>
            <Col xs={2}>{energy.toFixed(NUM_OF_DECIMALS)} kcal</Col>
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
            <Col xs={12} md={8}>
              {_.map(_.sortBy(meal.ingredients, ['name']), ingredient => {
                return this.renderIngredientRow(ingredient);
              })}
            </Col>
            <Col xs={12} md={4}>
              {this.renderMacroPieChart(meal)}
            </Col>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }

  renderMeals() {
    var totalCalories = 0;
    _.map(this.props.meals, meal => {
      _.map(meal.ingredients, ingredient => {
        totalCalories += ingredient.kcal * ingredient.mass / 100;
      });
    });
    return (
      <Grid>
        <h4>
          {this.props.meals.length} meals today, {totalCalories.toFixed(NUM_OF_DECIMALS)} kcal
        </h4>
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
        <DailyWater showTargetSettings={this.state.showMore} />
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
  fetchDefaultWaterTarget,
  deleteMeal
})(Meals);
