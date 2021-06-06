import updateObj from './../../utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  profile: '',
  error: null,
  editErr: null,
  loading: false,
  modalLoading: false,
  editSuccessful: false,
};
const getUserDataHandlerStart = (state, action) => {
  return updateObj(state, { error: null, loading: true });
};
const getUserDataFailHandler = (state, action) => {
  return updateObj(state, { error: action.err, loading: false });
};

const getUserDataSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    profile: action.data,
    loading: false,
    total: action.total,
  });
};
const editUserDataStartHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    modalLoading: true,
    editErr: null,
    editSuccessful: false,
  });
};
const editUserDataFailHandler = (state, action) => {
  return updateObj(state, {
    modalLoading: false,
    editErr: action.error,
    editSuccessful: false,
  });
};

const editUserDataSuccessHandler = (state, action) => {
  return updateObj(state, {
    editErr: null,
    modalLoading: false,
    editSuccessful: true,
    profile: action.user,
  });
};
const uploadPhotoStartHandler = (state, action) => {
  return updateObj(state, {
    editErr: null,
    modalLoading: true,
    editSuccessful: false,
  });
};
const uploadPhotoFailHandler = (state, action) => {
  return updateObj(state, {
    editErr: action.error,
    modalLoading: false,
    editSuccessful: false,
  });
};

const uploadPhotoSuccessHandler = (state, action) => {
  return updateObj(state, {
    editErr: null,
    modalLoading: false,
    profile: action.user,
    editSuccessful: true,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_DATA_START:
      return getUserDataHandlerStart(state, action);
    case actionTypes.GET_USER_DATA_SUCCESS:
      return getUserDataSuccessHandler(state, action);
    case actionTypes.GET_USER_DATA_FAIL:
      return getUserDataFailHandler(state, action);
    case actionTypes.EDIT_USER_DATA_START:
      return editUserDataStartHandler(state, action);
    case actionTypes.EDIT_USER_DATA_SUCCESS:
      return editUserDataSuccessHandler(state, action);
    case actionTypes.EDIT_USER_DATA_FAIL:
      return editUserDataFailHandler(state, action);
    case actionTypes.UPLOAD_PHOTO_START:
      return uploadPhotoStartHandler(state, action);
    case actionTypes.UPLOAD_PHOTO_SUCCESS:
      return uploadPhotoSuccessHandler(state, action);
    case actionTypes.UPLOAD_PHOTO_FAIL:
      return uploadPhotoFailHandler(state, action);

    default:
      return state;
  }
};

export default reducer;
