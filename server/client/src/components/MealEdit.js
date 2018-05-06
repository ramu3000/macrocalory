import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { fetchMeal, updateMeal } from '../actions';
import renderSearchField from './parts/form/search';

import { renderField, renderDateField, renderIngredients } from './parts/form/fields';
import validate from './parts/form/validate';

class MealEdit extends Component {
  componentDidMount() {
    this.props.fetchMeal(this.props.match.params.id);
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
    //send to action
    this.props.updateMeal(this.props.match.params.id, values, () => {
      this.props.history.push('/meals');
    });
  }
  
  chosenFood(foodInfo) {
    let newFoodInfo = {};
    for(let prop in foodInfo) { 
      switch(prop) {  
        case 'name':
          newFoodInfo[prop] = foodInfo[prop];
          break;
        case 'fineliId':
          newFoodInfo[prop] = foodInfo[prop];
          break; 
        default:
          newFoodInfo[prop] = Math.round(foodInfo[prop]*1000)/1000;

      } 
    }
    this.props.array.push('ingredients', newFoodInfo);
  }

  render() {
    if(!this.props.initialValues) {
      return <div></div>;
    } 
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div>
        <Link className="btn btn-primary" to="/meals">go back</Link>
        <h2>Edit your Meal - {this.props.meals.name}</h2>
        <form onSubmit={ handleSubmit(this.onSubmit.bind(this) )}>
          <div className="row">
            <Field 
              name="name"
              label="Meal name"
              component={renderField}
              size="col-xs-4"
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
          <Field 
            name="addIngredient"
            label="add custom ingredient"
            component={ renderSearchField }
            chosen={this.chosenFood.bind(this)}
          />
          <FieldArray name="ingredients" component={renderIngredients} />
          <div className="form__actions">
            <button type="submit" className="btn btn-success">Save your meal</button>
            <button type="button" className="btn btn-danger" disabled={pristine || submitting} onClick={reset}>
              back to default
            </button>

          </div>
        </form>
      </div>
    );
  }
}


function mapsStateToProps({ meals, date, ownProps }) {
  return { initialValues: meals, meals, date, ownProps };
}

let InitializeFromStateForm = reduxForm({
  // a unique name for the form
  form: 'editMeal',
  validate,
  enableReinitialize : true
})(MealEdit);

//and add redux connection
InitializeFromStateForm =  connect(mapsStateToProps,{fetchMeal,updateMeal})(InitializeFromStateForm);

export default InitializeFromStateForm;
