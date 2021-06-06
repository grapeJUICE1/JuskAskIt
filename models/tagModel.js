const mongoose = require('mongoose');

// initializing tag schema
const tagSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the tag'],
      unique: true,
      trim: true,
      maxlength: [25, 'A tag name must be less than 25 characters'],
    },
    postCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// initializing and exporting Tag model
const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
