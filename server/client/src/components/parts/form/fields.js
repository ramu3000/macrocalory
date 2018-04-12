import React from 'react';
import { Field } from 'redux-form';
import moment from 'moment';
import { DateTimePicker } from 'react-widgets';
import momentLocaliser from 'react-widgets-moment';
import 'react-widgets/dist/css/react-widgets.css'
momentLocaliser(moment)

//field parameter handles all events properties for Field component
export const renderField = function (field) {
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
};


export const renderDateField = function (field) {
  const { meta: { touched, error } } = field;
  const colSize =  field.size ? field.size: '';
  const className = `form-group ${colSize} ${ touched && error ? ' has-error' : ''} `;
  
  return (
    <div className={className}>
      <label>{field.label}</label>
      <DateTimePicker
        {...field.input}
        onChange={field.input.onChange}
        
        time={field.showTime}
        value={!field.input.value ? null : new Date(field.input.value)}
      />
    
      <div className="help-block">{touched ? error: ''}</div>
    </div>
  );
};

export const renderIngredients = function({ fields, meta: {error, submitFailed}}){ 
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
        {fields.map(function(ingredient, index) { 
          return (
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
                    component={renderField}
                    label="Ingredient"
                    size="col-xs-8" //bootstrap size 
                  />
                  <Field
                    name={`${ingredient}.mass`}
                    type="text"
                    placeholder="100"
                    component={renderField}
                    label="Määrä grammoissa tai millilitroissa "
                    size="col-xs-4" //bootstrap size 
                  />
                </div>
              </div>
            </li>
          );
        }
        )}
      </ul>
    </div>
  );
}

