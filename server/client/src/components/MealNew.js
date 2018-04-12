import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createMeal } from '../actions';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { renderField, renderDateField, renderIngredients } from './parts/form/fields';

class MealNew extends Component {

  formatTime(time,date){
    let newTime = moment(date, 'ddd MMM D YYYY HH:mm:ss ZZ');
    let formTime = (time).split(':');
    newTime.set({h: formTime[0], m: formTime[1], s: 0});
    return newTime.toDate();
  }
  addFatsecretValues() {
    //dummy values for now
    //Placeholder for values that fatsecret gives
    return {
      kcal: 200, //     
      protein: .5, //grams
      carbohydrate:  40, //grams
      fat: 20.12
    };
  }

  onSubmit(values){

    let newValues =_.map(values.ingredients, ingredient => {
      const obj = {};
      _.merge(obj,ingredient,this.addFatsecretValues());
      return obj;
    });
    values.ingredients = newValues;
    //send to action
    this.props.createMeal(values, () => {
      this.props.history.push('/meals');
    });


  }
  
  render(){
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div>
        <Link className="btn btn-primary" to="/meals">go back</Link>
        <h2>Add a new meal</h2>
        <form onSubmit={ handleSubmit(this.onSubmit.bind(this)) }>
          <div className="row">
            <Field 
              name="name"
              label="Meal name"
              component={renderField}
              size="col-xs-6"
            />
            <Field 
              name="date"
              label="Date & Time"
              placeholder="YYYY-MM-DD"
              component={renderDateField}
              size="col-xs-3"
              
              showTime={true}
            />
          </div>
          <FieldArray name="ingredients" component={renderIngredients} />
          <div className="form__actions">
            <button type="submit" className="btn btn-success">Save your meal</button>
            <button type="button" className="btn btn-danger" disabled={pristine || submitting} onClick={reset}>
              Clear Values
            </button>

          </div>
        </form>
      </div>
    );
  }
}

function validate(values){
  const errors = {}; 
  //validate the inputs
  if(!values.name){
    errors.name = 'Enter a Meal name';
  }
 
  if (!values.ingredients || !values.ingredients.length) {
    errors.ingredients = { _error: 'At least one ingredient must be entered' };
  } else {
    const ingredientsArrayErrors = [];
    values.ingredients.forEach((ingredient, ingredientIndex) => {
      const ingredientErrors = {};
      if (!ingredient || !ingredient.name) {
        ingredientErrors.name = 'please fill the ingredient name';
        ingredientsArrayErrors[ingredientIndex] = ingredientErrors;
      }
      if (!ingredient || !ingredient.mass) {
        ingredientErrors.mass = 'please fill mass of ingredient';
        ingredientsArrayErrors[ingredientIndex] = ingredientErrors;
      }
    });
    if (ingredientsArrayErrors.length) {
      errors.ingredients = ingredientsArrayErrors;
    }
  }
  //return empty object means no errors and form is valid
  return errors;
}
//getting props to this component
function mapsStateToProps({ date }) {
  return {  date };
}

export default reduxForm({
  validate,
  // a unique name for the form
  form: 'mealForm'
})(
  //and add redux connection
  connect(mapsStateToProps, {createMeal})(MealNew)
);