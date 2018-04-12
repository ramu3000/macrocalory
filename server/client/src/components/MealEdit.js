import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { fetchMeal, updateMeal } from '../actions';
import moment from 'moment';


import { renderField, renderDateField, renderIngredients } from './parts/form/fields';

class MealEdit extends Component {
  componentDidMount() {
    this.props.fetchMeal(this.props.match.params.id);
  }

  formatDate(value,name){
    if(!value){
      return value;
    }
    const dateStr = moment(value).isValid() ? moment(value).format('YYYY-MM-DD HH:MM'): value;
    return dateStr;
  }

  onSubmit(values){
    console.log(values);
    //send to action
    this.props.updateMeal(this.props.match.params.id, values, () => {
      //this.props.history.push('/meals');
    });


  }
    
  render() {
    if(!this.props.initialValues) {
      return <div></div>;
    } 
    const { handleSubmit, pristine, reset, submitting } = this.props;
    console.log(this.props)
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
  enableReinitialize : true
})(MealEdit);

//and add redux connection
InitializeFromStateForm =  connect(mapsStateToProps,{fetchMeal,updateMeal})(InitializeFromStateForm);

export default InitializeFromStateForm;
