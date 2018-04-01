import { FETCH_MEALS, CREATE_MEAL } from '../actions/types';

export default function(state = { count: 0 }, action) {
  switch (action.type) {
    case FETCH_MEALS:
      return action.payload;
    case CREATE_MEAL:
      return action.payload;
    default:
      return state;
  }
}