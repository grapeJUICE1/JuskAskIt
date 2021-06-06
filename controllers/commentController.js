const Comment = require('../models/commentModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

exports.createComment = handlerFactory.createOne(Comment, [
  'postedBy',
  'for',
  'content',
  'doc',
]);
exports.getCommentOfPost = handlerFactory.getAll(
  Comment,
  ['postsComments'],
  {
    for: 'Post',
  },
  'Comment'
);
exports.getCommentOfAnswer = handlerFactory.getAll(
  Comment,
  ['postsComments'],
  {
    for: 'Answer',
  },
  'Comment'
);
exports.like = handlerFactory.likeDislike(Comment, 'like', 'Comment');
exports.dislike = handlerFactory.likeDislike(Comment, 'dislike', 'Comment');
exports.getAllComments = handlerFactory.getAll(
  Comment,
  ['totalNumOfData'],
  {},
  'Comment'
);
exports.getOneComment = handlerFactory.getOne(Comment);
exports.deleteComment = handlerFactory.deleteOne(Comment);
exports.updateComment = handlerFactory.updateOne(Comment, ['content']);

exports.deleteCommentOfAnswer = catchAsync(async (req, res, next) => {
  await Comment.deleteMany({ for: 'Answer', doc: req.params.id });
  next();
});
exports.deleteCommentOfPost = catchAsync(async (req, res, next) => {
  await Comment.deleteMany({ for: 'Post', doc: req.params.id });
  next();
});
