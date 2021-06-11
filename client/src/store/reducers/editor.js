import updateObj from './../../utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  title: undefined,
  editedTitle: undefined,
  editedTags: undefined,
  editedContent: undefined,
};

const editStartHandler = (state, action) => {
  return updateObj(state, {
    title: action.title,
    editedTitle: action.editedTitle,
    editedTags: action.editedTags,
    editedContent: action.editedContent,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START:
      return editStartHandler(state, action);
    default:
      return state;
  }
};

export default reducer;
