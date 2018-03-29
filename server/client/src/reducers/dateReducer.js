import { CHOOSE_DATE } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case CHOOSE_DATE:
      return action.payload;
    default:
      return state;
  }
}