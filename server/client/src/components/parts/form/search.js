import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';

import { searchIngredients } from '../../../actions';

class SearchField extends Component {
  searchIngredient(e) {
    if(e.target.value) {
      this.props.searchIngredients(e.target.value);
    }
  }

  renderSearchField(field) {
    const { meta: { touched, error } } = field;
    const colSize =  field.size ? field.size: '';
    const className = `form-group ${colSize} ${ touched && error ? ' has-error' : ''} `;
    let ingredientSuggestion = [];

    if(this.props.ingredients.foods && this.props.ingredients.foods.food) {
      ingredientSuggestion = this.props.ingredients.foods.food;
    }
    
    return (
      <div className={className}>
        <label>{field.label}</label>
        <input
          name="test"
          placeholder={field.placeholder ? field.placeholder: ''}
          className="form-control"
          type="text"
          {...field.input} //generate all input events, like equliant to examples of: onChange={field.input.onChange} or onFocus={field.input.onFocus} or onBlur....
          onBlur={(e) => {
            this.searchIngredient(e);
          }}
        />
        { 
          ingredientSuggestion.map(function(ingredient, index) {
            return (
              <li onClick={ this.addIngredient.bind(this) } key={index}>{ingredient.food_name}</li>
            );
            
          })
        }
        <div className="help-block">{touched ? error: ''}</div>
      </div>
    );
  }
  addIngredient(e) {
    console.log(e);
  } 

  render() {
    return (
      <div>
        <Field 
          name="test"
          label="test dropdown"
          component={ this.renderSearchField.bind(this) }
        />
      </div>
    );
  }
}


//getting props to this component
function mapsStateToProps({ ingredients }) {
  return {   ingredients };
}

//and add redux connection
export default connect(mapsStateToProps, {searchIngredients })(SearchField);