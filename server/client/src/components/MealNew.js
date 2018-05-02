import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createMeal } from '../actions';

import { renderField, renderDateField, renderIngredients } from './parts/form/fields';

import renderSearchField from './parts/form/search';
import validate from './parts/form/validate';

class MealNew extends Component {

  constructor(props) {
    super(props);
    this.state = {addedIng: []};
    console.log('constructor',this.state)
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
  searchFieldClick(values){

  }

  chosenFood(e) {
    this.setState(prevState => ({
      addedIng: [...prevState.addedIng, e]
    }));
    console.log(e);
    console.log(this.state);
  }
  
  render(){
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div className="container">
        <h2>Add meal</h2>
        <form onSubmit={ handleSubmit(this.onSubmit.bind(this)) }>
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
          <Field 
            name="addIngredient"
            label="add custom ingredient"
            component={ renderSearchField }
            chosen={this.chosenFood}
          />
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

//getting props to this component
function mapsStateToProps({ date, ingredients }) {
  return {  date, ingredients };
}

export default reduxForm({
  validate,
  // a unique name for the form
  form: 'mealForm'
})(
  //and add redux connection
  connect(mapsStateToProps, {createMeal })(MealNew)
);