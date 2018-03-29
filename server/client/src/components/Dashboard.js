import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { fetchMeals } from '../actions';
import _ from 'lodash';

class Dashboard extends Component {
  renderDate() {
    const dateString = moment(this.props.date).format('ddd, DD of MMM YYYY');
    return <h2>{dateString}</h2>;
  }

  renderMealList() {
    function renderMealIngredients(meal) {
      return _.map(meal.ingredients, ingredient => {
        return <ListGroupItem key={ingredient._id}>{ingredient.name}</ListGroupItem>;
      });
    }
    return _.map(this.props.meals.meals, meal => {
      return (
        <Panel key={meal._id}>
          <Panel.Heading>{meal._id} - {meal.date} - {meal.name}</Panel.Heading>
          <ListGroup>{renderMealIngredients(meal)}</ListGroup>
        </Panel>
      );
    });
  }

  renderMeals() {
    return (
      <div>
        <h3>{this.props.meals.count} meals on this day</h3>
        {this.renderMealList()}
      </div>
    );
  }

  render() {
    return (
      <div>
        <div>{this.renderDate()}</div>
        <div>{this.renderMeals()}</div>
      </div>
    );
  }
}

function mapsStateToProps({ meals, date }) {
  return { meals, date };
}

export default connect(mapsStateToProps, { fetchMeals })(Dashboard);
