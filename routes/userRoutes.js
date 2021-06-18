const express = require('express');

const multer = require('multer');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const answerController = require('../controllers/answerController');
const { cloudinaryConfig } = require('../cloudinaryConfig');
const AppError = require('../utils/AppError');

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400));
  }
};

const limits = { fileSize: 10 * 1024 * 1024 };
const multerUploads = multer({
  storage,
  fileFilter: imageFilter,
  limits: limits,
}).single('photo');

// initializing express router
const router = express.Router();

// rouutes to do read operation on users
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getOneUser);

// route to do read operations on posts
router.route('/:id/posts').get(postController.getPostOfUser);
// router.route('/:id/answers').get(answerController.getPostOfUser);
// route to login and signup
router.post('/sign-up', authController.signUp);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post('/verify', authController.protect);

// route for updating user data except password
router.patch(
  '/update-me',
  authController.protect,
  userController.updateUserData
);
router.patch(
  '/upload-photo',
  multerUploads,
  cloudinaryConfig,
  authController.protect,
  userController.uploadPhoto
);
router.post(
  '/upload-post-photo',
  multerUploads,
  cloudinaryConfig,
  authController.protect,
  userController.uploadPostPhoto
);

// route for updating password
router.patch(
  '/update-password',
  authController.protect,
  authController.updatePassword
);

module.exports = router;
