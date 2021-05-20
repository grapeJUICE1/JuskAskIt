import axios from '../../axios-main';
import * as actionTypes from './actionTypes';
//importing axios because main instance has an error handling interceptor
//when i get user reactions , i dont want to trigger that

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
    } catch (err) {
      console.log(err);
      if (err.response.data.message)
        dispatch(LikeDislikePostFail(err.response.data));
      // else if (err.response.data) dispatch(fetchAnswersFail(err.response.data));
      else dispatch(LikeDislikePostFail(err));
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
export const submitPostSuccess = (post, submittedPostType) => {
  return {
    type: actionTypes.SUBMIT_POST_SUCCESS,
    post,
    submittedPostType,
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
  type = undefined,
  postId = undefined,
  forDoc = undefined
) => {
  return async (dispatch) => {
    dispatch(submitPostStart());
    try {
      let data = {
        title,
        content,
        userId,
        tags,
        contentWordCount,
        for: forDoc,
      };

      let res;
      if (type === 'edit') {
        res = await axios.patch(`/posts/${postId}`, data);
      } else if (type === 'answer') {
        res = await axios.post(`/answers/${postId}/create-answer`, data);
      } else if (type === 'answer-edit') {
        res = await axios.patch(`/answers/${postId}`, data);
      } else if (type === 'comment') {
        res = await axios.post(`/comments/${postId}/create-comment`, data);
      } else if (type === 'comment-edit') {
        res = await axios.patch(`/comments/${postId}`, data);
      } else {
        res = await axios.post(`/posts/create-post`, data);
      }

      dispatch(submitPostSuccess(res?.data?.data?.doc, type));
    } catch (err) {
      console.log(err);
      if (err.response.data.message)
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
