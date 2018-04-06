import { CHOOSE_DATE } from '../actions/types';

const initialState = new Date();

export default function(state = initialState, action) {
  switch (action.type) {
    case CHOOSE_DATE:
      return action.payload;
    default:
      return state;
  }
}
