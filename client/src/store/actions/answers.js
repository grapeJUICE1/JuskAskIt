import axios from '../../axios-main';
import * as actionTypes from './actionTypes';
//importing axios because main instance has an error handling interceptor
//when i get user reactions , i dont want to trigger that
import axiosGetLikesDislikes from 'axios';

export const fetchAnswersStart = () => {
  return {
    type: actionTypes.FETCH_ANSWERS_START,
  };
};
export const fetchAnswersFail = (error) => {
  return {
    type: actionTypes.FETCH_ANSWERS_FAIL,
    error,
  };
};
export const fetchAnswersSuccess = (answers, totalInPage, totalAnswers) => {
  return {
    type: actionTypes.FETCH_ANSWERS_SUCCESS,
    answers,
    totalInPage,
    totalAnswers,
  };
};
export const fetchAnswers = (postId, sortBy, currentPage, perPagePosts) => {
  return async (dispatch) => {
    dispatch(fetchAnswersStart());
    try {
      const res = await axios.get(`/posts/${postId}/answers`, {
        params: {
          sort: sortBy,
          limit: perPagePosts,
          page: currentPage,
        },
      });
      dispatch(
        fetchAnswersSuccess(
          res.data.data.docs,
          res.data.results,
          res.data.totalNumOfData
        )
      );
      // for (let ans of res.data.data.docs) {
      //   dispatch(checkUsersLikeDislikeAnswer(ans._id));
      // }
    } catch (err) {
      if (err.response) dispatch(fetchAnswersFail(err.response.data));
      else dispatch(fetchAnswersFail(err));
    }
  };
};

export const LikeDislikeAnswerStart = () => {
  return {
    type: actionTypes.LIKE_DISLIKE_ANSWER_START,
  };
};
export const LikeDislikeAnswerFail = (error) => {
  return {
    type: actionTypes.LIKE_DISLIKE_ANSWER_FAIL,
    error,
  };
};
export const LikeDislikeAnswerSuccess = (answer) => {
  return {
    type: actionTypes.LIKE_DISLIKE_ANSWER_SUCCESS,
    answer,
  };
};

export const LikeDislikeAnswer = (postId, likeordislike = 'like') => {
  return async (dispatch) => {
    dispatch(LikeDislikeAnswerStart());
    try {
      const res = await axios.post(`/answers/${postId}/${likeordislike}`);
      dispatch(LikeDislikeAnswerSuccess(res.data.data.doc));
      dispatch(checkUsersLikeDislikeAnswer(postId));
    } catch (err) {
      dispatch(LikeDislikeAnswerFail(err.response?.data?.message));
    }
  };
};
export const checkUsersLikeDislikeAnswerSuccess = (response, id) => {
  return {
    type: actionTypes.CHECK_USER_LIKE_DISLIKE_ANSWER,
    response,
    id,
  };
};
export const checkUsersLikeDislikeAnswerFail = () => {
  return {
    type: actionTypes.CHECK_USER_LIKE_DISLIKE_ANSWER_FAIL,
  };
};
export const checkUsersLikeDislikeAnswer = (postId) => {
  return async (dispatch) => {
    try {
      const res = await axiosGetLikesDislikes.get(
        `/answers/${postId}/get-all-reactions-of-user`,
        { withCredentials: true }
      );
      dispatch(checkUsersLikeDislikeAnswerSuccess(res.data.data, postId));
    } catch (err) {
      console.log(err);
      dispatch(checkUsersLikeDislikeAnswerFail());
    }
  };
};
