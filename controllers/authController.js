const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, 'process.env.JWT_SECRET', {
    expiresIn: '3d',
  });
};

const createSendToken = (user, statusCode, res, req) => {
  const token = signToken(user.id);
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
  res.set('SameSite', 'None');
  user.password = undefined;

  return res.status(statusCode).json({
    status: 'success',
    ll: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  req.user = newUser;
  createSendToken(newUser, 201, res, req);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide your email and password', 401));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  req.user = user;
  createSendToken(user, 200, res, req);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'hallelujah', {
    expires: new Date(Date.now() + 5),
  });
  return res.status(204).json({
    status: 'success',
    data: {},
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // if (!token && req.variable === 'checkIfexist') {
  //   return next();
  // }
  if (!token) {
    return next(
      new AppError('You are not logged in..Please Log in to continue', 401)
    );
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    'process.env.JWT_SECRET'
  );
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    if (req.variable === 'checkIfexist') {
      return next();
    }

    return next(
      new AppError(
        'User belonging to this token no longer exists , please Log in again to continue',
        401
      )
    );
  }
  if (currentUser.checkIfPasswordChanged(decodedToken.iat)) {
    if (req.variable === 'checkIfexist') {
      return next();
    }
    return next(
      new AppError(
        'You have currently changed password..Please log in again to continue',
        401
      )
    );
  }
  req.user = currentUser;
  if (req.body.type === 'autoLogin') {
    return res.status(200).json({
      status: 'success',
      data: {
        user: currentUser,
      },
    });
  }
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not permitted to perform this action'),
        401
      );
    }
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id).select('+password');

  if (!currentUser)
    return next(
      new AppError('You are not logged in . Please Log in to get access', 401)
    );

  const { currentPassword, passwordNew, confirmPasswordNew } = req.body;

  if (!currentPassword || !passwordNew || !confirmPasswordNew)
    return next(
      new AppError(
        'Please provide your current password , your new password and confirmed new password',
        400
      )
    );

  if (
    !(await currentUser.comparePassword(currentPassword, currentUser.password))
  )
    return next(new AppError('Incorrect password', 401));

  currentUser.password = passwordNew;
  currentUser.passwordConfirm = confirmPasswordNew;

  await currentUser.save();

  createSendToken(currentUser, 200, res, req);
});
