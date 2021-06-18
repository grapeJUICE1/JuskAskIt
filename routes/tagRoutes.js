const express = require('express');

// const authController = require('./../controllers/authController');
// const answerController = require('./../controllers/answerController');
// const postController = require('./../controllers/postController');
const tagController = require('../controllers/tagController');

// initializing express router
const router = express.Router();

router.route('/').get(tagController.getTags);
// router.get('/get-posts-for-tag/:tagName', tagController.getPostOfTag);

module.exports = router;
