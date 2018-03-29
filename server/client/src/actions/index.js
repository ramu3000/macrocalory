import axios from 'axios';
import moment from 'moment';

import { FETCH_USER, CHOOSE_DATE , FETCH_MEALS} from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const chooseDate = (date) => dispatch => {
  dispatch({ type: CHOOSE_DATE, payload: date });
};

export const fetchMeals = (date) => async dispatch => {
  const startOfDay = moment(date).startOf('day').toDate();
  const endOfDay = moment(date).endOf('day').toDate();
  const url = '/api/meals/?after=' + startOfDay.toISOString() + '&before=' + endOfDay.toISOString();
  const res = await axios.get(url);
  
  dispatch({ type: FETCH_MEALS, payload: res.data });
};