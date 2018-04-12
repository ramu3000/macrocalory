import axios from 'axios';
import moment from 'moment';

import {
  CHECKING_AUTHENTICATION,
  USER_DATA,
  CHOOSE_DATE,
  FETCH_DAILY_MEALS,
  FETCH_DAILY_WATER,
  CREATE_MEAL,
  DELETE_MEAL,
  FETCH_MEAL,
<<<<<<< 528af8fdcd3d8ee4095cbec624bbf914a8a334b2
  CLEAR_TRENDS_DATA,
  FETCH_TRENDS_WATER_DATA
=======
  UPDATE_MEAL
>>>>>>> working edit meal, styling header(maybe revert), small refactoring to new meal
} from './types';

export const fetchUser = () => async dispatch => {
  dispatch({ type: CHECKING_AUTHENTICATION });

  const res = await axios.get('/api/current_user');

  dispatch({ type: USER_DATA, payload: res.data });
};

export const chooseDate = date => dispatch => {
  dispatch({ type: CHOOSE_DATE, payload: date });
};

export const fetchDailyMeals = date => async dispatch => {
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

  dispatch({ type: FETCH_DAILY_MEALS, payload: res.data.meals });
};

export const fetchMeal = mealId => async dispatch => {
  const res = await axios.get(`/api/meals/${mealId}`);

  dispatch({ type: FETCH_MEAL, payload: res.data });
};

export const deleteMeal = mealId => async dispatch => {
  try {
    await axios.delete('/api/meals/' + mealId);
    dispatch({ type: DELETE_MEAL, payload: mealId });
  } catch (err) {
    dispatch({ type: DELETE_MEAL, payload: null });
  }
};

export const fetchDailyWater = date => async dispatch => {
  // Use moment to get string representing day in local time
  const day = moment(date).format('YYYY-MM-DD');
  const url = '/api/water/' + day;
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
  const url = '/api/water/' + day;
  const body = { desiliters };
  try {
    await axios.post(url, body);
    dispatch({ type: FETCH_DAILY_WATER, payload: desiliters });
  } catch (err) {
    dispatch({ type: FETCH_DAILY_WATER, payload: null });
  }
};

export const createMeal = (values, callback) => async dispatch => {
  try {
    const res = await axios.post('/api/meals/new', values);
    callback();
    dispatch({ type: CREATE_MEAL, payload: res.data.createdMeal });
  } catch (err) {
    dispatch({ type: CREATE_MEAL, payload: null });
  }
};

export const fetchTrendsWater = () => async dispatch => {
  const url = '/api/water';
  try {
    const res = await axios.get(url);
    dispatch({ type: FETCH_TRENDS_WATER_DATA, payload: res.data.dailyWaters });
  } catch (err) {
    dispatch({ type: FETCH_TRENDS_WATER_DATA, payload: [] });
  }
};

export const clearTrendsData = () => dispatch => {
  dispatch({ type: CLEAR_TRENDS_DATA, payload: {} });
};

export const updateMeal = (mealId, values, callback) => async dispatch => {
  const res = await axios.post(`/api/meals/${mealId}`, values);
  callback();
  dispatch({ type: UPDATE_MEAL, payload: res.data });
};
