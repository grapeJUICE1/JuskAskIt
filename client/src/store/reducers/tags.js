import updateObj from './../../utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  total: 0,
  totalTags: 0,
  tags: [],
  error: null,
  loading: false,
};

const fetchTagsStartHandler = (state, action) => {
  return updateObj(state, { error: null, tags: [], loading: true });
};
const fetchTagsSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    tags: action.tags,
    total: action.total,
    totalTags: action.totalTags,
    loading: false,
  });
};
const fetchTagsFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TAGS_START:
      return fetchTagsStartHandler(state, action);
    case actionTypes.FETCH_TAGS_SUCCESS:
      return fetchTagsSuccessHandler(state, action);
    case actionTypes.FETCH_TAGS_FAIL:
      return fetchTagsFailHandler(state, action);
    default:
      return state;
  }
};

export default reducer;
