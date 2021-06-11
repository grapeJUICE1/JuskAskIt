import updateObj from './../../utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  post: {},
  error: null,
  loading: false,
  userDidLike: false,
  userDidDislike: false,
  likeDislikeLoading: false,
  submitError: null,
  submitLoading: false,
  submitSuccessful: false,
  deleteError: null,
  deleteLoading: false,
  deleteSuccessful: false,
  editSuccessful: false,
  newPostUrl: null,
};

const fetchFullPostStartHandler = (state, action) => {
  return updateObj(state, { error: null, post: {}, loading: true });
};
const fetchFullPostSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    post: action.post,
    loading: false,
  });
};
const fetchFullPostFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
};
const likePostStartHandler = (state, action) => {
  return updateObj(state, { error: null, likeDislikeLoading: true });
};
const likePostSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    loading: false,
    post: action.post,
  });
};
const likePostFailHandler = (state, action) => {
  return updateObj(state, { loading: false });
};

const submitPostsStartHandler = (state, action) => {
  return updateObj(state, {
    submitLoading: action.resetAfterEdit ? false : true,
    submitSuccessful: false,
    editSuccessful: false,
    newPostUrl: null,
    submitError: null,
    deleteError: null,
    deleteLoading: false,
    deleteSuccessful: false,
  });
};
const submitPostsSuccessHandler = (state, action) => {
  return updateObj(state, {
    submitError: null,
    submitLoading: false,
    post:
      action.submittedPostType === 'answer' ||
      action.submittedPostType === 'answer-edit' ||
      action.submittedPostType === 'comment' ||
      action.submittedPostType === 'comment-edit'
        ? state.post
        : action.post,
    newPostUrl:
      action.submittedPostType === 'post'
        ? null
        : `/posts/post/${action.post._id}/${action.post.slug}`,
    editSuccessful:
      action.submittedPostType === 'edit' ||
      action.submittedPostType === 'answer-edit' ||
      action.submittedPostType === 'comment-edit'
        ? true
        : false,
    submitSuccessful:
      action.submittedPostType === 'answer' ||
      action.submittedPostType === 'comment'
        ? true
        : false,
  });
};
const submitPostsFailHandler = (state, action) => {
  return updateObj(state, {
    submitError: action.error,
    submitLoading: false,
    newPostUrl: null,
    editSuccessful: false,
  });
};
const deletePostsStartHandler = (state, action) => {
  return updateObj(state, {
    deleteError: null,
    deleteLoading: true,
    deleteSuccessful: false,
    post: { ...state.post },
  });
};
const deletePostsSuccessHandler = (state, action) => {
  return updateObj(state, {
    deleteError: null,
    deleteLoading: false,
    deleteSuccessful: action.submittedPostType,
    post: action.submittedPostType === 'post' ? state.post : { ...state.post },
  });
};
const deletePostsFailHandler = (state, action) => {
  return updateObj(state, {
    deleteError: action.error,
    deleteLoading: false,
    deleteSuccessful: false,
  });
};
const checkUsersLikeDislikePost = (state, action) => {
  let userDidLike = state.userDidLike;
  let userDidDislike = state.userDidDislike;

  if (action.response.doc) {
    if (action.response.doc.type === 'like') {
      userDidLike = true;
      userDidDislike = false;
    } else if (action.response.doc.type === 'dislike') {
      userDidDislike = true;
      userDidLike = false;
    }
  } else {
    userDidLike = false;
    userDidDislike = false;
  }
  return updateObj(state, {
    userDidLike: userDidLike,
    userDidDislike: userDidDislike,
    likeDislikeLoading: false,
  });
};
const checkUsersLikeDislikePostFail = (state, action) => {
  return updateObj(state, {
    userDidLike: false,
    userDidDislike: false,
    likeDislikeLoading: false,
    // post: { ...state.post },
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_FULL_POST_START:
      return fetchFullPostStartHandler(state, action);
    case actionTypes.FETCH_FULL_POST_SUCCESS:
      return fetchFullPostSuccessHandler(state, action);
    case actionTypes.FETCH_FULL_POST_FAIL:
      return fetchFullPostFailHandler(state, action);
    case actionTypes.LIKE_DISLIKE_POST_START:
      return likePostStartHandler(state, action);
    case actionTypes.LIKE_DISLIKE_POST_SUCCESS:
      return likePostSuccessHandler(state, action);
    case actionTypes.LIKE_DISLIKE_POST_FAIL:
      return likePostFailHandler(state, action);
    case actionTypes.CHECK_USER_LIKE_DISLIKE_POST:
      return checkUsersLikeDislikePost(state, action);
    case actionTypes.CHECK_USER_LIKE_DISLIKE_POST_FAIL:
      return checkUsersLikeDislikePostFail(state, action);
    case actionTypes.SUBMIT_POST_START:
      return submitPostsStartHandler(state, action);
    case actionTypes.SUBMIT_POST_SUCCESS:
      return submitPostsSuccessHandler(state, action);
    case actionTypes.SUBMIT_POST_FAIL:
      return submitPostsFailHandler(state, action);
    case actionTypes.DELETE_POST_START:
      return deletePostsStartHandler(state, action);
    case actionTypes.DELETE_POST_SUCCESS:
      return deletePostsSuccessHandler(state, action);
    case actionTypes.DELETE_POST_FAIL:
      return deletePostsFailHandler(state, action);
    // case actionTypes.FETCH_POST_COMMENTS_START:
    //   return fetchCommentsStart(state, action);
    // case actionTypes.FETCH_POST_COMMENTS_FAIL:
    //   return fetchCommentsFail(state, action);
    // case actionTypes.FETCH_POST_COMMENTS_SUCCESS:
    //   return fetchCommentsSuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
