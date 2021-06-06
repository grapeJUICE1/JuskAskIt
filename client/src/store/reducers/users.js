import updateObj from './../../utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  total: 0,
  totalUsers: 0,
  users: [],
  error: null,
  loading: false,
};

const fetchUsersStartHandler = (state, action) => {
  return updateObj(state, { error: null, users: [], loading: true });
};
const fetchUsersSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    users: action.users,
    total: action.total,
    totalUsers: action.totalUsers,
    loading: false,
  });
};
const fetchUsersFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USERS_START:
      return fetchUsersStartHandler(state, action);
    case actionTypes.FETCH_USERS_SUCCESS:
      return fetchUsersSuccessHandler(state, action);
    case actionTypes.FETCH_USERS_FAIL:
      return fetchUsersFailHandler(state, action);
    default:
      return state;
  }
};

export default reducer;
