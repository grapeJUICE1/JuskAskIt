const express = require('express');

const authController = require('./../controllers/authController');
const answerController = require('./../controllers/answerController');
const commentController = require('./../controllers/commentController');
const likeDislikeController = require('./../controllers/likeDislikeController');

//initializing express router
const router = express.Router();

//route to create answer
router.post(
  '/:id/create-answer',
  authController.protect,
  answerController.createAnswer
);

//route to do read operations on answers
router.get(
  '/',

  answerController.getAllAnswer
);
router.get(
  '/:id/get-answers',
  answerController.addVarToMiddleware,
  authController.protect,
  answerController.getAnswerOfPost
);
router.get('/:id/get-answers-of-user', answerController.getAnswersOfUser);

//route to like and dislike answer
router.post('/:id/like', authController.protect, answerController.like);
router.post('/:id/dislike', authController.protect, answerController.dislike);

router.get(
  '/:id/get-all-reactions-of-user',
  authController.protect,
  likeDislikeController.getLikeAndDislikesOfAnswerByUser
);
//route to get , update and delete single answer
router
  .route('/:id')
  .get(answerController.getOneAnswer)
  .patch(authController.protect, answerController.updateAnswer)
  .delete(
    authController.protect,
    commentController.deleteCommentOfAnswer,
    answerController.deleteAnswer
  );

module.exports = router;
