const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    title: String,
    read: {
      type: Boolean,
      default: false,
    },
    notificationImage: String,
    redirectTo: String,
    userLink: String,
    postNameInTitle: String,
    userNameInTitle: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
