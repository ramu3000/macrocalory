import { combineReducers } from 'redux';
import authReducer from './authReducer';
import dateReducer from './dateReducer';
import mealsReducer from './mealsReducer';

export default combineReducers({
  auth: authReducer,
  date: dateReducer,
  meals: mealsReducer
});