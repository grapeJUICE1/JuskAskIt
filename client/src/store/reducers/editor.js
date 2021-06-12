import updateObj from './../../utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  docToEdit: null,
  loading: false,
};

const fetchDocToEditStart = (state, action) => {
  return updateObj(state, {
    loading: true,
  });
};
const fetchDocToEditSuccess = (state, action) => {
  return updateObj(state, {
    docToEdit: action.doc,
    loading: false,
  });
};
const fetchDocToEditFail = (state, action) => {
  return updateObj(state, {
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_DOC_TO_EDIT_IN_EDITOR_START:
      return fetchDocToEditStart(state, action);
    case actionTypes.FETCH_DOC_TO_EDIT_IN_EDITOR_SUCCESS:
      return fetchDocToEditSuccess(state, action);
    case actionTypes.FETCH_DOC_TO_EDIT_IN_EDITOR_FAIL:
      return fetchDocToEditFail(state, action);
    default:
      return state;
  }
};

export default reducer;
