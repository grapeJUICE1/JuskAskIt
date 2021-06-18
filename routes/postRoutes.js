const express = require('express');

const authController = require('../controllers/authController');
const answerController = require('../controllers/answerController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const likeDislikeController = require('../controllers/likeDislikeController');

// initializing express router
const router = express.Router();

// route to get , update and delete single post
router
  .route('/:id')
  .get(postController.getOnePost)
  .patch(authController.protect, postController.updatePost)
  .delete(
    authController.protect,
    answerController.deleteAnswersOfPost,
    commentController.deleteCommentOfPost,
    postController.deletePost
  );

// route to like and dislike post
router.route('/:id/like').post(authController.protect, postController.like);
router.get(
  '/:id/get-all-reactions-of-user',
  authController.protect,
  likeDislikeController.getLikeAndDislikesOfPostByUser
);
router
  .route('/:id/dislike')
  .post(authController.protect, postController.dislike);

// route to create post
router
  .route('/')
  .get(postController.getAllPost)
  .post(authController.protect, postController.createNewPost);

// route to create answer
router
  .route('/:id/answers')
  .post(authController.protect, answerController.createAnswer)
  .get(answerController.getAnswerOfPost);

module.exports = router;
