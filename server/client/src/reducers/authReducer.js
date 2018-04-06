import { CHECKING_AUTHENTICATION, USER_DATA } from '../actions/types';

const initialState = {
  isLoading: false,
  data: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CHECKING_AUTHENTICATION:
      return {...initialState, isLoading: true};
    case USER_DATA:
      return { data: action.payload, isLoading: false};
    default:
      return state;
  }
}
