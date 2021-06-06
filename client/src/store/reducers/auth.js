import updateObj from './../../utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  user: null,
  loading: false,
  error: null,
  logoutError: null,
};

const loginStartHandler = (state, action) => {
  return updateObj(state, { error: null, loading: true });
};
const signUpStartHandler = (state, action) => {
  return updateObj(state, { error: null, loading: true });
};
const loginSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    user: action.user,
    loading: false,
  });
};
const signUpSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    user: action.user,
    loading: false,
  });
};
const loginFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
};
const signUpFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
};
const logoutHandler = (state, action) => {
  return updateObj(state, initialState);
};
const logoutFailHandler = (state, action) => {
  return updateObj(state, { logoutError: action.error });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START:
      return loginStartHandler(state, action);
    case actionTypes.LOGIN_SUCCESS:
      return loginSuccessHandler(state, action);
    case actionTypes.LOGIN_FAIL:
      return loginFailHandler(state, action);
    case actionTypes.SIGNUP_START:
      return signUpStartHandler(state, action);
    case actionTypes.SIGNUP_SUCCESS:
      return signUpSuccessHandler(state, action);
    case actionTypes.SIGNUP_FAIL:
      return signUpFailHandler(state, action);
    case actionTypes.LOGOUT:
      return logoutHandler(state, action);
    case actionTypes.LOGOUT_FAIL:
      return logoutFailHandler(state, action);
    default:
      return state;
  }
};

export default reducer;
