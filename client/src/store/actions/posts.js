import axios from '../../axios-main';
import * as actionTypes from './actionTypes';

export const fetchPostsStart = () => {
  return {
    type: actionTypes.FETCH_POSTS_START,
  };
};
export const fetchPostsFail = (error) => {
  return {
    type: actionTypes.FETCH_POSTS_FAIL,
    error,
  };
};
export const fetchPostsSuccess = (posts, total, totalPosts) => {
  return {
    type: actionTypes.FETCH_POSTS_SUCCESS,
    posts,
    total,
    totalPosts,
  };
};

export const fetchPosts = (
  sortBy,
  filter,
  currentPage,
  perPagePosts,
  userId,
  searchBy
) => {
  return async (dispatch) => {
    dispatch(fetchPostsStart());
    try {
      let link = '/posts';
      if (userId) {
        link = `/users/${userId}/posts`;
      }

      const res = await axios.get(link, {
        params: {
          sort: sortBy,
          limit: perPagePosts,
          page: currentPage,
          search: searchBy,
          ...filter,
        },
      });

      dispatch(
        fetchPostsSuccess(
          res.data.data.docs,
          res.data.results,
          res.data.totalNumOfData
        )
      );
    } catch (err) {
      console.log(err);
      if (err.response.data.message)
        dispatch(fetchPostsFail(err.response.data));
      else dispatch(fetchPostsFail(err));
    }
  };
};
