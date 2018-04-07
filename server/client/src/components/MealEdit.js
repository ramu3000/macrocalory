import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { fetchMeal } from '../actions';
import { Link } from 'react-router-dom';
import _ from 'lodash';


class MealEdit extends Component {
  componentDidMount() {
    this.props.fetchMeal(this.props.match.params.id);
  }

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
                <div className="col-sm-2">
                  <button
                    className="btn btn-danger remove-ingredient"
                    type="button"
                    title="Remove ingredient"
                    onClick={() => fields.remove(index)}
                  >
                  X
                  </button>
                </div>
                <div className="col-sm-10">
                  <Field
                    name={`${ingredient}.name`}
                    type="text"
                    placeholder="type an ingredient"
                    component={this.renderField}
                    label="Ingredient"
                    size="col-xs-8" //bootstrap size 
                  />
                  <Field
                    name={`${ingredient}.mass`}
                    type="text"
                    placeholder="100"
                    component={this.renderField}
                    label="Määrä grammoissa tai millilitroissa "
                    size="col-xs-4" //bootstrap size 
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
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
