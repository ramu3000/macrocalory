import { CLEAR_TRENDS_DATA, FETCH_TRENDS_WATER_DATA } from '../actions/types';

const initialValue = {
  water: []
};

export default function(state = initialValue, action) {
  switch (action.type) {
    case CLEAR_TRENDS_DATA:
      return initialValue;
    case FETCH_TRENDS_WATER_DATA:
      return {...state, water: action.payload};
    default:
      return state;
  }
}
