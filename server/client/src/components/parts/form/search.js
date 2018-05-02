import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm, arrayPush } from 'redux-form';

import { searchIngredients } from '../../../actions';

class SearchField extends Component {

  constructor (props) {
    super(props);
  }

  searchIngredient(e) {
    if(e.target.value) {
      this.props.searchIngredients(e.target.value);
    }
  }
  renderSearchField(field) {
    const { meta: { touched, error } } = field;
    const colSize =  field.size ? field.size: '';
    const className = `form-group ${colSize} ${ touched && error ? ' has-error' : ''} `;
   
    
    return (
      <div className={className}>
        <label>{field.label}</label>
        <input
          name={field.name}
          placeholder={field.placeholder ? field.placeholder: ''}
          className="form-control"
          type="text"
          {...field.input} //generate all input events, like equliant to examples of: onChange={field.input.onChange} or onFocus={field.input.onFocus} or onBlur....
          onBlur={(e) => {
            this.searchIngredient(e);
          }}
        />
        
        <div className="help-block">{touched ? error: ''}</div>
      </div>
    );
  }
  addIngredient(ingredients) { 
    let a = false;
    let specificValue = (ins) => {
      this.props.chosen(ins);
      a = true;
    };

    if(a) {return (<div></div>)}
    return (
      ingredients.map(function(ingredient, index) {
        return (
          <li onClick={() => specificValue(ingredient) } key={index}>{ingredient.name}</li>
        );
        
      })
    );
  }

  render() {
    let ingredientSuggestion = [];  

    if(this.props.ingredients && this.props.ingredients.data) {
  
      ingredientSuggestion = this.props.ingredients.data;
    }

    return (
      <div>
        <Field 
          name="test"
          label="Search Ingredient"
          component={ this.renderSearchField.bind(this) }
        />
        <div>
          <ul className="ingredients">
            {
              this.addIngredient(ingredientSuggestion)
            }
          </ul>
        </div>
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