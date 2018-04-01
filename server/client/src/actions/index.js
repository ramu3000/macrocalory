import axios from 'axios';
import moment from 'moment';

import {
  FETCH_USER,
  CHOOSE_DATE,
  FETCH_MEALS,
  FETCH_DAILY_WATER,
  CREATE_MEAL
} from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const chooseDate = date => dispatch => {
  dispatch({ type: CHOOSE_DATE, payload: date });
};

export const fetchMeals = date => async dispatch => {
  const startOfDay = moment(date)
    .startOf('day')
    .toDate();
  const endOfDay = moment(date)
    .endOf('day')
    .toDate();
  const url =
    '/api/meals/?after=' +
    startOfDay.toISOString() +
    '&before=' +
    endOfDay.toISOString();
  const res = await axios.get(url);

  dispatch({ type: FETCH_MEALS, payload: res.data });
};

export const fetchDailyWater = date => async dispatch => {
  // Use moment to get string representing day in local time
  const day = moment(date).format('YYYY-MM-DD');
  const url = 'api/water/' + day;
  try {
    const res = await axios.get(url);
    dispatch({ type: FETCH_DAILY_WATER, payload: res.data.desiliters });
  } catch (err) {
    dispatch({ type: FETCH_DAILY_WATER, payload: null });
  }
};

export const setWater = (date, desiliters) => async dispatch => {
  // Use moment to get string representing day in local time
  const day = moment(date).format('YYYY-MM-DD');
  const url = 'api/water/' + day;
  const body = { desiliters };
  try {
    await axios.post(url, body);
    dispatch({ type: FETCH_DAILY_WATER, payload: desiliters });
  } catch (err) {
    dispatch({ type: FETCH_DAILY_WATER, payload: null });
  }
};
export const createMeal = (values) => async dispatch => {
  const res = await axios.post('/api/meals/new', values);
  dispatch({type:CREATE_MEAL, payload: res.data});
};
