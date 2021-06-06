const Answer = require('../models/answerModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

exports.createAnswer = handlerFactory.createOne(Answer, [
  'post',
  'content',
  'postedBy',
  'contentWordCount',
]);
exports.like = handlerFactory.likeDislike(Answer, 'like', 'Answer');
exports.dislike = handlerFactory.likeDislike(Answer, 'dislike', 'Answer');
exports.getAllAnswer = handlerFactory.getAll(
  Answer,
  ['totalNumOfData'],
  {},
  'Answer'
);
exports.getOneAnswer = handlerFactory.getOne(Answer);
exports.getAnswerOfPost = handlerFactory.getAll(
  Answer,
  ['postsDoc', 'checkIfUserLikeDisliked'],
  {},
  'Answer'
);
exports.getAnswersOfUser = handlerFactory.getAll(
  Answer,
  ['usersDoc'],
  {},
  'Answer'
);
exports.deleteAnswer = handlerFactory.deleteOne(Answer, [
  'postOfCreatedAnswer',
]);
exports.updateAnswer = handlerFactory.updateOne(Answer, [
  'content',
  'contentWordCount',
]);

exports.deleteAnswersOfPost = catchAsync(async (req, res, next) => {
  await Answer.deleteMany({ post: req.params.id });
  next();
});
