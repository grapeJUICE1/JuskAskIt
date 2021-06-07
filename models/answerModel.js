const mongoose = require('mongoose');
const Post = require('./postModel');

// initializing answer schema
const answerSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'answer must belong to a post.'],
    },
    content: {
      type: String,
      required: [true, 'Please provide the content of your answer'],
    },
    contentWordCount: {
      type: Number,
      required: [true, 'Please provide content count for your answer'],
      min: [25, 'your answer should have atleast 15 words'],
    },
    likeCount: { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    voteCount: { type: Number, default: 0 },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    sortBest: { type: Number, default: 0 },
  },
  { timestamps: true }
);

answerSchema.post('save', async function () {
  const post = await Post.findById(this.post);
  post.answerCount = await this.model('Answer').countDocuments({
    post: this.post,
  });
  post.save();
});

answerSchema.pre(/^find/, function (next) {
  // populating postedBy
  this.populate({ path: 'postedBy' });
  // this.populate({ path: 'post' });
  next();
});
answerSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    const post = await Post.findById(this.post);
    post.answerCount -= 1;
    next();
  }
);

// initializing and exporting Answer model
const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
