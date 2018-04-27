import {
  CLEAR_TRENDS_DATA,
  FETCH_TRENDS_WATER_DATA,
  FETCH_TRENDS_MEALS_DATA
} from '../actions/types';

const initialValue = {};

export default function(state = initialValue, action) {
  switch (action.type) {
    case CLEAR_TRENDS_DATA:
      return initialValue;
    case FETCH_TRENDS_WATER_DATA:
      return {
        ...state,
        waters: action.payload !== null ? action.payload : []
      };
    case FETCH_TRENDS_MEALS_DATA:
      return { ...state, meals: action.payload !== null ? action.payload : [] };
    default:
      return state;
  }
}
