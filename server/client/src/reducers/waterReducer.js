import { FETCH_DAILY_WATER } from '../actions/types';

export default function(state = 0, action) {
  switch (action.type) {
    case FETCH_DAILY_WATER:
      return !(action.payload === null) ? action.payload : 0;
    default:
      return state;
  }
}
