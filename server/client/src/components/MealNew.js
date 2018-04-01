import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { createMeal } from '../actions';
import { Link } from 'react-router-dom';
import moment from 'moment';


class FoodNew extends Component {

  //field parameter handles all events properties for Field component
  renderField(field) {
    const { meta: { touched, error } } = field;
    const colSize =  field.size ? field.size: '';
    const className = `form-group ${colSize} ${ touched && error ? ' has-error' : ''} `;
    
    return (
      <div className={className}>
        <label>{field.label}</label>
        <input
          placeholder={field.placeholder ? field.placeholder: ''}
          className="form-control"
          type="text"
          {...field.input} //generate all input events, like equliant to examples of: onChange={field.input.onChange} or onFocus={field.input.onFocus} or onBlur....
        />
        <div className="help-block">{touched ? error: ''}</div>
      </div>
    );
  }

  renderIngredients({ fields, meta: {error, submitFailed}}){ 
    return(
      <div>
        <div className="row">
          <div className="col-sm-3">
            <h3 className="form__subtitle">Ingredients</h3>
          </div>
          <div className="col-sm-3">
            <button className="btn btn-primary" type="button" onClick={() => fields.push({})}>
              Add ingredient
            </button>
          </div>
        </div>
        <ul>
          <li>
            {submitFailed && error && <span>{error}</span>}
          </li>
          {fields.map((ingredient, index) => (
            <li key={index}>
              <h4>Ingredient #{index + 1}</h4>
              <div className="row">
                <div className="col-sm-3">
                  <button
                    className="btn btn-danger remove-ingredient"
                    type="button"
                    title="Remove ingredient"
                    onClick={() => fields.remove(index)}
                  >
                  X
                  </button>
                </div>
                <div className="col-sm-9">
                  <Field
                    name={`${ingredient}.name`}
                    type="text"
                    placeholder="type an ingredient"
                    component={this.renderField}
                    label="Ingredient"
                    size="col-xs-12" //bootstrap size 
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  formatTime(time,date){
    let newTime = moment(date, 'ddd MMM D YYYY HH:mm:ss ZZ');
    let formTime = (time).split(':');
    newTime.set({h: formTime[0], m: formTime[1]}).toDate();
    return newTime;
  }

  onSubmit(values){
    values.date = this.formatTime(values.time, moment(this.props.date));
    console.log(values);
    this.props.createMeal(values, () => {
      this.props.history.push('/dashboard');
    });

  }
  
  render(){
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <div>
        <Link className="btn btn-primary" to="/dashboard">go back</Link>
        <h2>Add food</h2>
        <form onSubmit={ handleSubmit(this.onSubmit.bind(this)) }>
          <div className="row">
            <Field 
              name="name"
              label="Meal name"
              component={this.renderField}
              size="col-xs-6"
            />
            <Field 
              name="time"
              label="Meal time"
              placeholder="12:00"
              component={this.renderField}
              size="col-xs-2"
            />
          </div>
          <FieldArray name="ingredients" component={this.renderIngredients.bind(this)} />
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

  const time = values.time ? values.time.split(':') : null;
  //values -> {mealname: 'asdfasd', food: 'asdfasdf'}
  const errors = {}; 
  //validate the inputs
  if(!values.name){
    errors.name = 'Enter a Meal name';
  }
  if(!time){
    errors.time = 'add time';
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
  form: 'foodForm'
})(
  //and add redux connection
  connect(mapsStateToProps, {createMeal})(FoodNew)
);