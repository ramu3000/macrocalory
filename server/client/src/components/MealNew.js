import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createMeal } from '../actions';

import {
  renderField,
  renderDateField,
  renderIngredients
} from './parts/form/fields';
import validate from './parts/form/validate';

class MealNew extends Component {
  addFatsecretValues() {
    //dummy values for now
    //Placeholder for values that fatsecret gives
    return {
      kcal: 200, //
      protein: 0.5, //grams
      carbohydrate: 40, //grams
      fat: 20.12
    };
  }

  onSubmit(values) {
    let newValues = _.map(values.ingredients, ingredient => {
      const obj = {};
      _.merge(obj, ingredient, this.addFatsecretValues());
      return obj;
    });
    values.ingredients = newValues;
    //send to action
    this.props.createMeal(values, () => {
      this.props.history.push('/meals');
    });
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div className="container">
        <h2>Add meal</h2>
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <div className="row">
            <Field
              name="name"
              label="Meal name"
              component={renderField}
              size="col-sm-4"
            />
            <Field
              name="date"
              label="Date & Time"
              placeholder="YYYY-MM-DD"
              component={renderDateField}
              size="col-sm-4 col-md-3"
              showTime={true}
            />
          </div>
          <FieldArray name="ingredients" component={renderIngredients} />
          <div className="form__actions">
            <button type="submit" className="btn btn-success">
              Save your meal
            </button>
            <button
              type="button"
              className="btn btn-danger"
              disabled={pristine || submitting}
              onClick={reset}
            >
              Clear Values
            </button>
          </div>
        </form>
      </div>
    );
  }
}

//getting props to this component
function mapsStateToProps({ date }) {
  return { date };
}

export default reduxForm({
  validate,
  // a unique name for the form
  form: 'mealForm'
})(
  //and add redux connection
  connect(mapsStateToProps, { createMeal })(MealNew)
);
