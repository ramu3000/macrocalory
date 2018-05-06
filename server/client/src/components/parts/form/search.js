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
            if((e.target.value).length >= 3){
              this.searchIngredient(e);
            }
          }}
        />
        
        <div className="help-block">{touched ? error: ''}</div>
      </div>
    );
  }
  addIngredient() { 

    let specificValue = (ins) => {
      this.props.chosen(ins);
    };
    console.log(this.props);
    if(this.props.ingredients.length === 0 ) {
      return <div></div>;
    }
    return (
      this.props.ingredients.data.map(function(ingredient, index) {
        return (
          <li className="list-group-item" onClick={() => specificValue(ingredient) } key={index}>{ingredient.name}</li>
        );
        
      })
    );
  }

  render() {

    return (
      <div>
        <Field 
          name="test"
          label="Search Ingredient"
          component={ this.renderSearchField.bind(this) }
        />
        <div>
          <ul className="ingredients list-group list-group-hover list-product-search scrollbar">
            {
              this.addIngredient()
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