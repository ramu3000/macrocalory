import { FETCH_INGREDIENTS } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_INGREDIENTS:
      return action.payload;
    default:
      return state;
  }
}