/* eslint-disable no-underscore-dangle */
const { htmlToText } = require('html-to-text');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/ApiFeatures');
const filterObj = require('../utils/filterObj');
const Post = require('../models/postModel');
const LikeDislike = require('../models/likeDislikeModel');
const tagValidation = require('../utils/tagValidation');
const Notification = require('../models/notifications');
const socket = require('../server');
const Answer = require('../models/answerModel');
const User = require('../models/userModel');

exports.createOne = (Model, allowedFields = []) =>
  catchAsync(async (req, res) => {
    req.body = filterObj(req.body, allowedFields);

    if (allowedFields.includes('post')) {
      req.body.post = req.params.id;
    }
    if (allowedFields.includes('doc')) {
      req.body.doc = req.params.id;
    }
    if (allowedFields.includes('postedBy')) {
      req.body.postedBy = req.user.id;
    }

    const newDoc = await Model.create(req.body);
    if (
      Model.collection.collectionName === 'answers' ||
      Model.collection.collectionName === 'comments'
    ) {
      const parentModel =
        Model.collection.collectionName === 'answers' ? Post : Answer;
      const parentPost = await parentModel.findById(
        Model.collection.collectionName === 'answers' ? newDoc.post : newDoc.doc
      );
      const title = `${
        Model.collection.collectionName === 'answers' ? 'answered' : 'commented'
      } to your ${
        Model.collection.collectionName === 'answers' ? 'question' : 'answer'
      }`;
      const postNameInTitle =
        Model.collection.collectionName === 'answers'
          ? parentPost.title
          : `${htmlToText(parentPost.content, {
              wordwrap: 130,
            }).substring(0, 100)}...`;
      const postRedirectId =
        Model.collection.collectionName === 'answers'
          ? parentPost._id
          : parentPost.post;
      await Notification.create({
        title,
        user: parentPost.postedBy._id,
        notificationImage: req.user.photo,
        redirectTo: `/posts/post/${postRedirectId}#${newDoc._id}`,
        userLink: `/profile/${req.user._id}`,
        postNameInTitle,

        userNameInTitle: req.user.name,
      });
      if (parentPost.postedBy._id) {
        socket.ioObject.to(`${parentPost.postedBy._id}`).emit('change_data');
      }
    }
    return res.status(201).json({
      status: 'success',
      data: {
        doc: newDoc,
      },
    });
  });

exports.getAll = (Model, allowedFields = [], filter = {}, forModel = null) =>
  catchAsync(async (req, res, next) => {
    const updatedFilter = filter;
    if (allowedFields.includes('usersDoc')) {
      updatedFilter.postedBy = req.params.id;
    }
    if (allowedFields.includes('postsDoc')) {
      updatedFilter.post = req.params.id;
    }
    if (allowedFields.includes('postsComments')) {
      updatedFilter.doc = req.params.id;
    }
    if (allowedFields.includes('nameSearch')) {
      updatedFilter.name = {
        $regex: req.query.search,
        $options: 'i',
      };
    }
    if (allowedFields.includes('titleSearch')) {
      updatedFilter.title = {
        $regex: req.query.search || '',
        $options: 'i',
      };
    }
    if (allowedFields.includes('tagSearch')) {
      updatedFilter.name = {
        $regex: req.query.search || '',
        $options: 'i',
      };
    }

    if (allowedFields.includes('likeDislike')) {
      updatedFilter.for = forModel;
      updatedFilter.doc = req.params.id;
      updatedFilter.user = req.user.id;

      const doc = await Model.findOne(filter);
      return res.status(200).json({
        status: 'success',
        data: {
          doc,
        },
      });
    }
    // uses the apifeatures.js from util folder to implement
    // pagination , filtering , sorting and limiting

    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;
    // sending error if no post was found
    if (!docs) {
      return next(
        new AppError(
          'Sorry no posts have been made yet.....start by creating a post',
          404
        )
      );
    }

    // sending total number of post in the database with the response
    const totalNumOfData = allowedFields.includes('totalNumOfData')
      ? await new ApiFeatures(Model.countDocuments(filter), req.query).filter(
          true
        ).query
      : null;

    return res.status(200).json({
      status: 'success',
      totalNumOfData: totalNumOfData || null,
      results: docs.length,
      data: {
        docs,
      },
    });
  });
exports.getOne = (Model, allowedFields = []) =>
  catchAsync(async (req, res, next) => {
    let doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError('No doc found with that id', 404));

    if (allowedFields.includes('views')) {
      doc.views += 1;
    }
    doc = await doc.save();
    return res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.likeDislike = (Model, type, forDoc) =>
  catchAsync(async (req, res) => {
    console.log(type);
    // checking if user has liked the post ago or not
    const checkIfLiked = await LikeDislike.findOne({
      type: 'like',
      for: forDoc,
      doc: req.params.id,
      user: req.user.id,
    });
    const checkIfDisLiked = await LikeDislike.findOne({
      type: 'dislike',
      for: forDoc,
      doc: req.params.id,
      user: req.user.id,
    });

    // if user has liked the post earlier , unlike it
    if (checkIfLiked) {
      const doc = await Model.findById(checkIfLiked.doc);
      await LikeDislike.deleteMany({
        type: 'like',
        for: forDoc,
        doc: req.params.id,
        user: req.user.id,
      });
      doc.likeCount = await LikeDislike.countDocuments({
        type: 'like',
        for: forDoc,
        doc: req.params.id,
      });
      doc.voteCount = doc.likeCount - doc.dislikeCount;

      await doc.save();
      if (type === 'like') {
        return res.status(200).json({
          status: 'success',
          data: { doc },
        });
      }
    }
    if (checkIfDisLiked) {
      const doc = await Model.findById(checkIfDisLiked.doc);
      await LikeDislike.deleteMany({
        type: 'dislike',
        for: forDoc,
        doc: req.params.id,
        user: req.user.id,
      });
      doc.dislikeCount = await LikeDislike.countDocuments({
        type: 'dislike',
        for: forDoc,
        doc: req.params.id,
      });
      doc.voteCount = doc.likeCount - doc.dislikeCount;

      await doc.save();
      if (type === 'dislike') {
        return res.status(200).json({
          status: 'success',
          data: { doc },
        });
      }
    }
    // if user hasn't liked the post , let user like the post
    await LikeDislike.create({
      type,
      user: req.user.id,
      for: forDoc,
      doc: req.params.id,
    });

    const doc = await Model.findById(req.params.id);
    if (type === 'like') {
      const numToIncReptutationBy =
        forDoc === 'Post'
          ? 2
          : forDoc === 'Answer'
          ? 3
          : forDoc === 'Comment'
          ? 1
          : 1;
      console.log(
        numToIncReptutationBy,
        doc.postedBy.reputation,
        doc.postedBy._id
      );
      let userReputation = doc.postedBy.reputation || 0;
      await User.findByIdAndUpdate(doc.postedBy._id, {
        reputation: (userReputation += numToIncReptutationBy),
      });
      doc.likeCount = await LikeDislike.countDocuments({
        type,
        for: forDoc,
        doc: req.params.id,
      });
    } else if (type === 'dislike') {
      await User.findByIdAndUpdate(doc.postedBy.id, {
        reputation: (doc.postedBy.reputation -= 1),
      });
      doc.dislikeCount = await LikeDislike.countDocuments({
        type,
        for: forDoc,
        doc: req.params.id,
      });
    }
    doc.voteCount = doc.likeCount - doc.dislikeCount;
    if (doc.likeCount === 1) {
      const { collectionName } = Model.collection;
      const title = " got it's first upvote";

      // eslint-disable-next-line no-nested-ternary
      const postRedirectId =
        collectionName === 'posts'
          ? doc._id
          : collectionName === 'answers'
          ? doc.post
          : doc.doc;
      const postNameInTitle =
        collectionName === 'posts'
          ? doc.title
          : `${htmlToText(doc.content, {
              wordwrap: 130,
            }).substring(0, 100)}...`;
      await Notification.create({
        title,
        user: doc.postedBy._id,
        notificationImage:
          'https://res.cloudinary.com/grapecluster/image/upload/v1621597330/justAskItLogo.png',
        redirectTo: `/posts/post/${postRedirectId}#${doc._id}`,
        postNameInTitle,
      });
      if (doc.postedBy._id) {
        socket.ioObject.to(`${doc.postedBy._id}`).emit('change_data');
      }
    }
    await doc.save();
    return res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const post = await Model.findById(req.params.id);
    if (!post) return next(new AppError('No document found with that id', 404));
    if (post.postedBy.id !== req.user.id) {
      return next(
        new AppError(
          "You do not have permission to update this document as this document isn't yours",
          401
        )
      );
    }
    await Model.findByIdAndDelete(req.params.id);
    return res.status(204).json({
      status: 'success',
    });
  });

exports.updateOne = (Model, allowedFields = []) =>
  catchAsync(async (req, res, next) => {
    const filteredReq = filterObj(req.body, allowedFields);

    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError('No document found with that id', 404));
    if (doc.postedBy.id !== req.user.id) {
      return next(
        new AppError(
          "You do not have permission to update this document as this document isn't yours",
          401
        )
      );
    }
    const updatedDoc = await Model.findByIdAndUpdate(
      req.params.id,
      filteredReq,
      { new: true, runValidators: true }
    );
    if (updatedDoc.tags) {
      tagValidation(updatedDoc.tags, next, Post);
    }
    return res.status(200).json({
      status: 'success',
      data: { doc: updatedDoc },
    });
  });
