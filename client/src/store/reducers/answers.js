import updateObj from './../../utils/updateObj';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  answers: [],
  error: null,
  loading: false,
  likeDislikeAnswerLoading: false,
  likeDislikeCommentLoading: false,
  total: 0,
};

const fetchAnswersStartHandler = (state, action) => {
  return updateObj(state, { error: null, answers: [], loading: true });
};
const fetchAnswersSuccessHandler = (state, action) => {
  return updateObj(state, {
    error: null,
    answers: action.answers,
    loading: false,
    total: action.total,
  });
};
const fetchAnswersFailHandler = (state, action) => {
  return updateObj(state, { error: action.error, loading: false });
};

const likeAnswerStartHandler = (state, action) => {
  return updateObj(state, { error: null, likeDislikeAnswerLoading: true });
};
const likeAnswerSuccessHandler = (state, action) => {
  let answer = action.answer;
  // let answer = action.answer;
  let answersCopy = [...state.answers];
  let updatedAnswerIndex = answersCopy.findIndex(
    (obj) => obj._id === answer._id
  );

  answersCopy[updatedAnswerIndex].voteCount = answer.voteCount;
  answersCopy[updatedAnswerIndex].likeCount = answer.likeCount;
  answersCopy[updatedAnswerIndex].dislikeCount = answer.dislikeCount;

  return updateObj(state, {
    error: null,
    loading: false,
    answers: answersCopy,
  });
};
const likeAnswerFailHandler = (state, action) => {
  return updateObj(state, {
    likeDislikeAnswerLoading: false,
  });
};
const checkUsersLikeDislikeAnswer = (state, action) => {
  let answersCopy = [...state.answers];
  let updatedAnswerIndex = answersCopy.findIndex(
    (obj) => obj._id === action.id
  );

  if (action.response.doc) {
    if (action.response.doc.type === 'like') {
      answersCopy[updatedAnswerIndex].userDidLike = true;
      answersCopy[updatedAnswerIndex].userDidDislike = false;
    } else if (action.response.doc.type === 'dislike') {
      answersCopy[updatedAnswerIndex].userDidDislike = true;
      answersCopy[updatedAnswerIndex].userDidLike = false;
    }
  } else {
    answersCopy[updatedAnswerIndex].userDidLike = false;
    answersCopy[updatedAnswerIndex].userDidDislike = false;
  }
  return updateObj(state, {
    answers: answersCopy,
    likeDislikeAnswerLoading: false,
  });
};
const checkUsersLikeDislikeAnswerFail = (state, action) => {
  return updateObj(state, {
    likeDislikeAnswerLoading: false,
  });
};

const checkUsersLikeDislikeComment = (state, action) => {
  let answersCopy = [...state.answers];

  let updatedAnswerIndex = answersCopy.findIndex(
    (obj) => obj._id === action.ansId
  );

  let commentsCopy = [...answersCopy[updatedAnswerIndex].comments];
  let updatedCommentIndex = commentsCopy.findIndex(
    (obj) => obj._id === action.id
  );

  if (action.response.doc) {
    if (action.response.doc.type === 'like') {
      commentsCopy[updatedCommentIndex].userDidLike = true;
      commentsCopy[updatedCommentIndex].userDidDislike = false;
    } else if (action.response.doc.type === 'dislike') {
      commentsCopy[updatedCommentIndex].userDidDislike = true;
      commentsCopy[updatedCommentIndex].userDidLike = false;
    }
  } else {
    commentsCopy[updatedCommentIndex].userDidLike = false;
    commentsCopy[updatedCommentIndex].userDidDislike = false;
  }
  answersCopy[updatedAnswerIndex].comments = commentsCopy;
  return updateObj(state, {
    answers: answersCopy,
  });
};
const checkUsersLikeDislikeCommentFail = (state, action) => {
  return updateObj(state, {
    likeDislikeCommentLoading: false,
  });
};
const fetchCommentsStart = (state, action) => {
  return updateObj(state, {
    commentError: null,
  });
};
const fetchCommentsFail = (state, action) => {
  return updateObj(state, {
    commentError: action.error,
  });
};
const fetchCommentsSuccess = (state, action) => {
  let answersCopy = [...state.answers];
  let updatedAnswerIndex = answersCopy.findIndex(
    (obj) => obj._id === action.id
  );

  answersCopy[updatedAnswerIndex].comments = action.comments;

  return updateObj(state, {
    comments: action.comments,

    answers: answersCopy,
  });
};

const likeDislikeCommentStart = (state, action) => {
  return updateObj(state, {
    commentError: null,
    likeDislikeCommentLoading: true,
  });
};
const likeDislikeCommentFail = (state, action) => {
  return updateObj(state, {
    commentError: action.error,
  });
};
const likeDislikeCommentSuccess = (state, action) => {
  let answersCopy = JSON.parse(JSON.stringify(state.answers));
  let updatedAnswerIndex = answersCopy.findIndex(
    (obj) => obj._id === action.comments.doc
  );

  let answersComments = answersCopy[updatedAnswerIndex].comments;
  let updatedAnswerCommentIndex = answersComments.findIndex(
    (obj) => obj._id === action.comments._id
  );

  answersComments[updatedAnswerCommentIndex] = action.comments;

  answersCopy[updatedAnswerIndex].comments = answersComments;

  return updateObj(state, {
    answers: answersCopy,
    likeDislikeCommentLoading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ANSWERS_START:
      return fetchAnswersStartHandler(state, action);
    case actionTypes.FETCH_ANSWERS_SUCCESS:
      return fetchAnswersSuccessHandler(state, action);
    case actionTypes.FETCH_ANSWERS_FAIL:
      return fetchAnswersFailHandler(state, action);
    case actionTypes.LIKE_DISLIKE_ANSWER_START:
      return likeAnswerStartHandler(state, action);
    case actionTypes.LIKE_DISLIKE_ANSWER_SUCCESS:
      return likeAnswerSuccessHandler(state, action);
    case actionTypes.LIKE_DISLIKE_ANSWER_FAIL:
      return likeAnswerFailHandler(state, action);
    case actionTypes.CHECK_USER_LIKE_DISLIKE_ANSWER:
      return checkUsersLikeDislikeAnswer(state, action);
    case actionTypes.CHECK_USER_LIKE_DISLIKE_ANSWER_FAIL:
      return checkUsersLikeDislikeAnswerFail(state, action);
    case actionTypes.CHECK_USER_LIKE_DISLIKE_ANSWER_COMMENT:
      return checkUsersLikeDislikeComment(state, action);
    case actionTypes.CHECK_USER_LIKE_DISLIKE_ANSWER_COMMENT_FAIL:
      return checkUsersLikeDislikeCommentFail(state, action);
    case actionTypes.FETCH_ANSWER_COMMENTS_START:
      return fetchCommentsStart(state, action);
    case actionTypes.FETCH_ANSWER_COMMENTS_FAIL:
      return fetchCommentsFail(state, action);
    case actionTypes.FETCH_ANSWER_COMMENTS_SUCCESS:
      return fetchCommentsSuccess(state, action);
    case actionTypes.LIKE_DISLIKE_ANSWER_COMMENT_START:
      return likeDislikeCommentStart(state, action);
    case actionTypes.LIKE_DISLIKE_ANSWER_COMMENT_FAIL:
      return likeDislikeCommentFail(state, action);
    case actionTypes.LIKE_DISLIKE_ANSWER_COMMENT_SUCCESS:
      return likeDislikeCommentSuccess(state, action);

    default:
      return state;
  }
};

export default reducer;
