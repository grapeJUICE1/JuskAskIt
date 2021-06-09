const mongoose = require('mongoose');

// initializing comment schema
const commentSchema = mongoose.Schema(
  {
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    for: {
      type: String,
      enum: {
        values: ['Post', 'Answer'],
        message: 'you can comment either a post or answer',
      },
      required: ['True', 'Chose wether to comment a post or answer'],
    },
    doc: { type: mongoose.Schema.ObjectId, refPath: 'for', required: true },
    postId: { type: mongoose.Schema.ObjectId, ref: 'Post', required: true },
    content: {
      type: String,
      required: [true, 'Please tell what you want to comment'],
    },
    likeCount: { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    voteCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

commentSchema.pre(/^find/, function (next) {
  // populating postedBy
  this.populate({ path: 'postedBy', select: 'name email photo' });
  next();
});

// initializing and exporting Comment model
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
