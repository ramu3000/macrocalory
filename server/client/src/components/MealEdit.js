import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { fetchMeal } from '../actions';
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
    
    console.log(value,name);
    const dateStr = moment(value).isValid() ? moment(value).format('YYYY-MM-DD'): value;
    return dateStr;
  }
    
  render() {
    if(!this.props.initialValues) {
      return <div></div>;
    } 
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div>
        <Link className="btn btn-primary" to="/dashboard">go back</Link>
        <h2>Edit food</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <Field 
              name="name"
              label="Meal name"
              component={renderField}
              size="col-xs-4"
            />
            <Field 
              name="date"
              label="date"
              placeholder="YYYY-MM-DD"
              component={renderDateField}
              size="col-xs-4"
              format={this.formatDate}
            />
            <Field 
              name="time"
              label="Meal time"
              placeholder="12:00"
              component={renderField}
              size="col-xs-2"
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
  return { initialValues: meals, date, ownProps };
}

let InitializeFromStateForm = reduxForm({
  // a unique name for the form
  form: 'editMeal',
  enableReinitialize : true
})(MealEdit);

//and add redux connection
InitializeFromStateForm =  connect(mapsStateToProps,{fetchMeal})(InitializeFromStateForm);

export default InitializeFromStateForm;
