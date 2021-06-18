import axios from '../../axios-main';
import * as actionTypes from './actionTypes';
//importing axios because main instance has an error handling interceptor
//when i get user reactions , i dont want to trigger that
import axiosGetLikesDislikes from 'axios';

export const fetchFullPostStart = () => {
  return {
    type: actionTypes.FETCH_FULL_POST_START,
  };
};
export const fetchFullPostFail = (error) => {
  return {
    type: actionTypes.FETCH_FULL_POST_FAIL,
    error,
  };
};
export const fetchFullPostSuccess = (post) => {
  return {
    type: actionTypes.FETCH_FULL_POST_SUCCESS,
    post,
  };
};

export const fetchFullPost = (postId) => {
  return async (dispatch) => {
    dispatch(fetchFullPostStart());
    try {
      const res = await axios.get(`/posts/${postId}`);

      dispatch(fetchFullPostSuccess(res.data.data.doc));
      dispatch(checkUsersLikeDislikePost(res.data.data.doc._id));
    } catch (err) {
      console.log(err);
      if (err.response.data.message)
        dispatch(fetchFullPostFail(err.response.data));
      // else if (err.response.data) dispatch(fetchAnswersFail(err.response.data));
      else dispatch(fetchFullPostFail(err));
    }
  };
};

export const LikeDislikePostStart = () => {
  return {
    type: actionTypes.LIKE_DISLIKE_POST_START,
  };
};
export const LikeDislikePostFail = (error) => {
  return {
    type: actionTypes.LIKE_DISLIKE_POST_FAIL,
    error,
  };
};
export const LikeDislikePostSuccess = (post) => {
  return {
    type: actionTypes.LIKE_DISLIKE_POST_SUCCESS,
    post,
  };
};

export const LikeDislikePost = (postId, likeordislike = 'like') => {
  return async (dispatch) => {
    dispatch(LikeDislikePostStart());
    try {
      const res = await axios.post(`/posts/${postId}/${likeordislike}`);
      dispatch(LikeDislikePostSuccess(res.data.data.doc));
      dispatch(checkUsersLikeDislikePost(postId));
    } catch (err) {
      console.log(err);
      dispatch(checkUsersLikeDislikePostFail());
      if (err.response.data.message)
        dispatch(LikeDislikePostFail(err.response.data));
      // else if (err.response.data) dispatch(fetchAnswersFail(err.response.data));
      else dispatch(LikeDislikePostFail(err));
    }
  };
};

export const checkUsersLikeDislikePostSuccess = (response) => {
  return {
    type: actionTypes.CHECK_USER_LIKE_DISLIKE_POST,
    response,
  };
};
export const checkUsersLikeDislikePostFail = () => {
  return {
    type: actionTypes.CHECK_USER_LIKE_DISLIKE_POST_FAIL,
  };
};
export const checkUsersLikeDislikePost = (postId) => {
  return async (dispatch) => {
    try {
      const res = await axiosGetLikesDislikes.get(
        `/posts/${postId}/get-all-reactions-of-user`,
        { withCredentials: true }
      );
      dispatch(checkUsersLikeDislikePostSuccess(res.data.data));
    } catch (err) {
      console.log(err);
      dispatch(checkUsersLikeDislikePostFail());
    }
  };
};

export const submitPostStart = (resetAfterEdit = false) => {
  return {
    type: actionTypes.SUBMIT_POST_START,
    resetAfterEdit,
  };
};
export const submitPostFail = (error) => {
  return {
    type: actionTypes.SUBMIT_POST_FAIL,
    error,
  };
};
export const submitPostSuccess = (
  post,
  submittedPostType,
  redirectToId,
  docId
) => {
  return {
    type: actionTypes.SUBMIT_POST_SUCCESS,
    post,
    submittedPostType,
    redirectToId,
    docId,
  };
};

export const resetEditSuccess = () => {
  return (dispatch) => {
    dispatch(submitPostStart(true));
  };
};
export const submitPost = (
  title,
  content,
  userId,
  tags,
  contentWordCount,
  type,
  docId = undefined,
  forDoc = undefined,
  bestAnswer = undefined,
  postId = undefined
) => {
  return async (dispatch) => {
    dispatch(submitPostStart());
    try {
      console.log(postId);
      let data = {
        title,
        content,
        userId,
        tags,
        contentWordCount,
        for: forDoc,
        bestAnswer,
        postId,
      };
      let res;
      console.log(type, docId);
      if (type === 'edit') {
        res = await axios.patch(`/posts/${docId}`, data);
      } else if (type === 'answer') {
        res = await axios.post(`/posts/${docId}/answers`, data);
      } else if (type === 'answer-edit') {
        res = await axios.patch(`/answers/${docId}`, data);
      } else if (type === 'comment') {
        res = await axios.post(`/answers/${docId}/comments`, data);
      } else if (type === 'comment-edit') {
        res = await axios.patch(`/comments/${docId}`, data);
      } else {
        res = await axios.post(`/posts`, data);
      }
      dispatch(submitPostSuccess(res?.data?.data?.doc, type, postId, docId));
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message)
        dispatch(submitPostFail(err?.response?.data?.message));
    }
  };
};

export const deletePostStart = () => {
  return {
    type: actionTypes.DELETE_POST_START,
  };
};
export const deletePostFail = (error) => {
  return {
    type: actionTypes.DELETE_POST_FAIL,
    error,
  };
};
export const deletePostSuccess = (submittedPostType) => {
  return {
    type: actionTypes.DELETE_POST_SUCCESS,
    submittedPostType,
  };
};

export const deletePost = (type, postId) => {
  return async (dispatch) => {
    dispatch(deletePostStart());
    try {
      let link = `/${type}s/${postId}`;
      await axios.delete(link);
      dispatch(deletePostSuccess(type));
    } catch (err) {
      dispatch(deletePostFail(err));
    }
  };
};
