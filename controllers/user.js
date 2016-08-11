/**
 * Created by Ming Tae on 2016/8/11
 */

const _ = require('lodash');

const user = require('./services/user');
const status = require('../enums/resStatus');
const verifyEmail = require('../helpers/verifyEmail');

/**
 * 用户注册 - POST
 * @param {Object}      req
 * @param {String}      req.body.name
 * @param {String}      req.body.email
 * @Param {String}      req.body.password
 * @param {String}      [req.body.headPic]  - 用户头像
 * @param {Number}      [req.body.sex]      - 性别，0男1女，默认为null
 * @param {String}      [req.body.bio]      - 用户简介
 * @param {Object}      res
 * @param {Function}    next
 */
exports.register = function (req, res, next) {
  let userObj = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  if (_.values(userObj).filter(Boolean).length < Object.keys(userObj).length) {
    return res.api(...status.lackParams);
  }
  if (!verifyEmail(userObj.email)) {
    return res.api(...status.invalidEmail);
  }

  userObj.sex = req.body.sex || null;
  userObj.bio = req.body.bio || '这家伙很懒，什么也没写';
  userObj.headPic = req.body.headPic || '';

  // TODO: register service
  user.register(userObj)
  .then(function (ret) {
    return res.api(...status.registerParams);
  })
  .catch(function (err) {
    return res.api(...status.registerFailParams);
  });
};

/**
 * 用户登录 - POST
 * @param {Object} req
 * @param {String} req.body.name
 * @param {String} req.body.email
 * @param {String} req.body.password
 */
exports.login = function (req, res, next) {
  if (!req.body.password || !(req.body.name || req.body.email)) {
    return res.api(...status.lackParams);
  }

  let userObj = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  };

  user.login(userObj)
  .then(function (ret) {
    req.session = ret;
    return res.api(...status.loginParams);
  })
  .catch(function (err) {
    return res.api(...status.loginFailParams);
  })
};

/**
 * 用户登出 - GET
 * @param {Object} req
 */
exports.logout = function (req, res, next) {
    req.session.destoy();
    res.clearCookie(req.query.name);
    return res.api(...status.logoutParams);
};
