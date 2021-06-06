const mongoose = require('mongoose');

//  initializing likeDislikeSchema schema
const likeDislikeSchema = mongoose.Schema({
  type: {
    type: String,
    enums: {
      values: ['like', 'dislike'],
      message: 'you can either like or dislike',
    },
    required: ['True', 'Chose wether to like or dislike'],
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  for: {
    type: String,
    enums: {
      values: ['Post', 'Answer', 'Comment'],
      message: 'you can like/dislike either a post or answer or comment',
    },
    required: ['True', 'Chose wether to like/dislike a post or answer'],
  },
  doc: { type: mongoose.Schema.ObjectId, refPath: 'for', required: true },
});

// initializing and exporting LikeDislike model
const LikeDislike = mongoose.model('LikeDislike', likeDislikeSchema);

module.exports = LikeDislike;
