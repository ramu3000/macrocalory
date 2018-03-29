import { FETCH_MEALS } from '../actions/types';

export default function(state = { count: 0 }, action) {
  switch (action.type) {
    case FETCH_MEALS:
      return action.payload;
    default:
      return state;
  }
}