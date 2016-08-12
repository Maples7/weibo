/**
 * Created by Ming Tae on 2016/8/11
 */

const _ = require('lodash');

const user = require('./services/user');
const status = require('../enums/resStatus');
const verifyEmail = require('../helpers/verifyEmail');

/**
 * 用户注册 - POST
 * @param {Object}      req.body
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

  user.register(userObj)
  .then(ret=> res.api('注册成功'))
  .catch(err => res.api_error(err));
};

/**
 * 用户登录 - POST
 * @param {Object} req.body
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
    return res.api('登录成功');
  })
  .catch(err => res.api_error(err));
};

/**
 * 用户登出 - GET
 * @param {Object} req.body
 */
exports.logout = function (req, res, next) {
  req.session.destoy();
  res.clearCookie(req.query.name);
  return res.api('登出成功');
};

/**
 * 用户修改信息 - PUT
 * @param {Object} req.body
 * @param {String} req.body.name
 * @param {String} req.body.email
 * @param {String} req.body.password
 * @param {String} 
 */
exports.modifyInfo = function (req, res, next) {
  let where = {name: req.session.user.name};
  
  return user.modify(name, req.body)
  .then(ret => res.api(ret))
  .catch(err => res.api(err));
}

/**
 * 用户修改关注表 - PUT
 * @param {Object} req.body
 * @param {String} req.body.fans
 * @param {String} req.body.follows
 * @param {String} [req.body.remark] -备注名
 * @param {String} [req.body.group]  -分组数组
 */
exports.modifyRelationship = function (req, res, next) {
  let action = req.body.act;
  switch (action) {
    case 'follow':
      return user.follow(req.body)
      .then(ret => res.api('关注成功'))
      .catch(err => res.api(err));
    case 'unfollow':
      return user.unfollow(req.body)
      .then(ret => res.api('取消关注成功'))
      .catch(err => res.api(err));
    case 'remark':
      return user.remark(req.body)
      .then(ret => res.api('修改备注成功'))
      .catch(err => res.api(err));
    case 'regroup':
      return user.regroup(req.body)
      .then(ret => res.api('编辑分组成功'))
      .catch(err => res.api(err));
    case 'blcak':
      return user.black(req.body)
      .then(ret => res.api('拉黑成功'))
      .catch(err => res.api(err));
    default:
      return res.api(...status.apiNotFound);
  }
}

/**
 * 用户修改微博数 - PUT
 * @param {Object} req.body
 * @param {String} req.body.act
 * @param {String} req.body.name
 */
exports.modifyWeiboCount = function (req, res, next) {
  let param = {action: req.body.act, name: req.body.name}
  return user.modifyWeiboCoun(param);
}

/**
 * 用户修改分组信息 - PUT
 * @param {Object} req.body
 * @param {Object} req.body.group -分组新信息
 * @param {String} req.body.old -分组旧名
 */
exports.modifyGroup = function (req, res, next) {
  if (req.body.old === '未分组' || req.body.old === '黑名单') {
    throw (new Error('固定分组不可更改'));
  }
  if (req.body.group.name === '未分组' || req.body.group.name === '黑名单') {
    throw (new Error('不可与固定分组重名'));
  }
  return user.modifyGroup(req.body.old, req.session.user.name, req.body.group)
  .then(ret => res.api('修改分组信息成功'))
  .catch(err => res.api(err));
}

/**
 * 用户删除分组 - DELETE
 * @param {Object} req.body
 * @param {String} req.body.old -分组旧名
 */
exports.deleteGroup = function (req, res, next) {
  if (req.body.old === '未分组' || req.body.old === '黑名单') {
    throw (new Error('固定分组不可删除'));
  }
  return user.deleteGroup(req.body.old, req.session.user.name)
  .then(ret => res.api('删除分组成功'))
  .catch(err => res.api(err));
}