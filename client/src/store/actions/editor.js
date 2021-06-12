import axios from '../../axios-main';
import * as actionTypes from './actionTypes';

export const fetchDocToEditStart = () => {
  return {
    type: actionTypes.FETCH_DOC_TO_EDIT_IN_EDITOR_START,
  };
};

export const fetchDocToEditSuccess = (doc, docType) => {
  return {
    type: actionTypes.FETCH_DOC_TO_EDIT_IN_EDITOR_SUCCESS,
    doc,
    docType,
  };
};

export const fetchDocToEditFail = () => {
  return {
    type: actionTypes.FETCH_DOC_TO_EDIT_IN_EDITOR_FAIL,
  };
};

export const fetchDocToEdit = (docId, type) => {
  return async (dispatch) => {
    dispatch(fetchDocToEditStart());
    try {
      let route = '';
      route = type === 'edit' ? `/posts/${docId}` : `/answers/${docId}`;

      const res = await axios.get(route);
      dispatch(fetchDocToEditSuccess(res.data.data.doc, type));
    } catch (err) {
      dispatch(fetchDocToEditFail());
      console.log(err);
    }
  };
};
