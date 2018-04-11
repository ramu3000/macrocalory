import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import dateReducer from './dateReducer';
import mealsReducer from './mealsReducer';
import waterReducer from './waterReducer';
import trendsReducer from './trendsReducer';

export default combineReducers({
  auth: authReducer,
  date: dateReducer,
  meals: mealsReducer,
  water: waterReducer,
  form: formReducer,
  trends: trendsReducer
});