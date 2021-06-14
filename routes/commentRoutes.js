const express = require('express');

const authController = require('../controllers/authController');
const commentController = require('../controllers/commentController');
const likeDislikeController = require('../controllers/likeDislikeController');

// const answerController = require('./../controllers/answerController');

// initializing express router
const router = express.Router();

// route to get , update and delete single comment
router
  .route('/:id')
  .get(commentController.getOneComment)
  .patch(authController.protect, commentController.updateComment)
  .delete(authController.protect, commentController.deleteComment);

// route to do read operations on comments
router.get('/', commentController.getAllComments);
router.get('/:id/get-comments-of-post', commentController.getCommentOfPost);
router.get('/:id/get-comments-of-answer', commentController.getCommentOfAnswer);

// route to create comment
router.post(
  '/:id/create-comment',
  authController.protect,
  commentController.createComment
);
router.get(
  '/:id/get-all-reactions-of-user',
  authController.protect,
  likeDislikeController.getLikeAndDislikesOfCommentByUser
);
// route to like dislike comments
router.post('/:id/like', authController.protect, commentController.like);
router.post('/:id/dislike', authController.protect, commentController.dislike);

module.exports = router;
