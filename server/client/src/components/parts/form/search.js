import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';

import { searchIngredients } from '../../../actions';

class SearchField extends Component {

  constructor(props){
    super(props);
    this.doesItWork = this.doesItWork.bind(this);
  }
  searchIngredient(e) {
    if(e.target.value) {
      this.props.searchIngredients(e.target.value);
    }
  }

  addIngredient(e) {
  
      ingredientSuggestion.map(function(ingredient, index) {

        return (
          <li onClick={ () => { this.props.doesItWork(ingredient);} } key={index}>{ingredient.name}</li>
        );
        
      })
    
    return (
      <div></div>
    );
  } 

  renderSearchField(field) {
    const { meta: { touched, error } } = field;
    const colSize =  field.size ? field.size: '';
    const className = `form-group ${colSize} ${ touched && error ? ' has-error' : ''} `;
    let ingredientSuggestion = [];  

    if(this.props.ingredients && this.props.ingredients.data) {
  
      ingredientSuggestion = this.props.ingredients.data;
    }
    
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
  render() {
    return (
      <div>
        <Field 
          name="test"
          label="test dropdown"
          component={ this.renderSearchField.bind(this) }
        />
        <FieldList

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