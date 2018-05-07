import React from 'react';
import { Field } from 'redux-form';
import moment from 'moment';
import { DateTimePicker } from 'react-widgets';
import momentLocaliser from 'react-widgets-moment';
import 'react-widgets/dist/css/react-widgets.css';
momentLocaliser(moment);

//field parameter handles all events properties for Field component
export const renderField = function(field) {
  const {
    meta: { touched, error }
  } = field;
  const colSize = field.size ? field.size : '';
  const className = `form-group ${colSize} ${
    touched && error ? ' has-error' : ''
  } `;

  return (
    <div className={className}>
      <label>{field.label}</label>
      <input
        placeholder={field.placeholder ? field.placeholder : ''}
        className="form-control"
        type="text"
        {...field.input} //generate all input events, like equliant to examples of: onChange={field.input.onChange} or onFocus={field.input.onFocus} or onBlur....
      />
      <div className="help-block">{touched ? error : ''}</div>
    </div>
  );
};

export const renderDateField = function(field) {
  const {
    meta: { touched, error }
  } = field;
  const colSize = field.size ? field.size : '';
  const className = `form-group ${colSize} ${
    touched && error ? ' has-error' : ''
  } `;

  return (
    <div className={className}>
      <label>{field.label}</label>
      <DateTimePicker
        {...field.input}
        onChange={field.input.onChange}
        time={field.showTime}
        value={!field.input.value ? null : new Date(field.input.value)}
      />

      <div className="help-block">{touched ? error : ''}</div>
    </div>
  );
};

export const renderIngredients = function({
  fields,
  meta: { error, submitFailed }
}) {
  return (
    <div>
      <ul>
        <li>{submitFailed && error && <span>{error}</span>}</li>
        {fields.map(function(ingredient, index) {
          return (
            <li key={index}>
              <div className="row ingredient">
                <div className="col-sm-1">
                  <button
                    className="btn btn-danger remove-ingredient"
                    type="button"
                    title="Remove ingredient"
                    onClick={() => fields.remove(index)}
                  >
                    X
                  </button>
                </div>
                <div className="col-sm-11">
                  <div className="row">
                    <Field
                      name={`${ingredient}.name`}
                      type="text"
                      placeholder="type an ingredient"
                      component={renderField}
                      label={`Ingredient #${index + 1}`}
                      size="col-md-4" //bootstrap size
                    />
                    <Field
                      name={`${ingredient}.mass`}
                      type="text"
                      placeholder="100"
                      component={renderField}
                      label="Quantity (g/ml)"
                      size="col-xs-8 col-sm-5 col-md-2" //bootstrap size
                    />
                    <Field
                      name={`${ingredient}.kcal`}
                      type="text"
                      placeholder="kcal"
                      component={renderField}
                      label="kcal (per 100g)"
                      size="col-xs-4 col-sm-5 col-md-2"
                    />
                    <Field
                      name={`${ingredient}.fat`}
                      type="text"
                      placeholder="fat"
                      component={renderField}
                      label="fat (per 100g)"
                      size="col-xs-4 col-sm-5 col-md-2"
                    />
                    <Field
                      name={`${ingredient}.protein`}
                      type="text"
                      placeholder="protein"
                      component={renderField}
                      label="protein (per 100g)"
                      size="col-xs-4 col-sm-5 col-md-2"
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="row ingredient-actions">
        <div className="col-sm-6">
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => fields.push({})}
          >
            Add ingredient
          </button>
        </div>
      </div>
    </div>
  );
};
