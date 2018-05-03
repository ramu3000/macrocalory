import {
  FETCH_DAILY_WATER,
  FETCH_DEFAULT_WATER_TARGET
} from '../actions/types';

const initialState = { desiliters: 0, target: 0, defaultTarget: 0 };

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_DAILY_WATER:
      if (action.payload === null) {
        return { ...state, desiliters: 0, target: 0 };
      } else {
        return { ...state, ...action.payload };
      }
    case FETCH_DEFAULT_WATER_TARGET:
      if (action.payload === null) {
        return { ...state, defaultTarget: 0 };
      } else {
        return { ...state, ...action.payload };
      }
    default:
      return state;
  }
}
