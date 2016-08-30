/**
 * Created by Ming Tse on 2016/8/11
 */

const _ = require('lodash');
const Promise = require('bluebird');

const user = require('../services/user');
const status = require('../enums/resStatus');
const verifyEmail = require('../helpers/verifyEmail');
const aCode = require('../tools/code');

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
  .catch(err => res.api_error(err.message));
};

/**
 * 用户登录 - POST
 * @param {Object} req.body
 * @param {String} req.body.account - 用户名或邮箱
 * @param {String} req.body.password
 */
exports.login = function (req, res, next) {
  let account = req.body.account;
  if (!req.body.password || !account) {
    return res.api(...status.lackParams);
  }

  let userObj = {password: req.body.password};
  if (verifyEmail(account)) {
    userObj.email = account;
  }
  else {
    userObj.name = account;
  }

  user.login(userObj)
  .then(function (ret) {
    if (!ret) {
      return res.api('账号或密码错误');
    }
    req.session.user = ret.dataValues;
    return res.api('登录成功');
  })
  .catch(err => res.api_error(err.message));
};

/**
 * 用户登出 - GET
 * @param {Object} req.query
 * @param {String} req.query.name
 */
exports.logout = function (req, res, next) {
  req.session.destroy();
  res.clearCookie(req.query.name);
  return res.api('登出成功');
};

/**
 * 用户修改信息 - PUT
 * @param {Object} req.body
 * @param {String} req.body.name
 * @param {String} 
 */
exports.modifyInfo = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  // 获取当前用户的用户名作旧名
  let id = req.session.user.id;
  return user.modifyInfo(id, req.body)
  .then(function (ret) {
    req.session.user = ret;
    return res.api('信息修改成功');
  })
  .catch(err => res.api_error(err.message));
}

/**
 * 发起发送邮箱请求 - GET
 */
exports.sendMail = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  let name = req.session.user.name;
  let email = req.query.email;
  let code = aCode();
  return Promise.promisify(user.sendMail)(name, email, code)
  .then(() => user.saveCode(email, code))
  .then(() => res.api('邮件发送成功'))
  .catch(err => res.api_error(err.message));
}

/**
 * 用户验证邮箱 - PUT
 * @param {Object} req.body
 * @param {String} req.body.id
 * @param {String} req.body.act - 修改/绑定/解绑
 * @param {String} req.body.email - 修改时为新邮箱，绑定/解绑时为旧邮箱
 * @param {String} req.body.code
 */
exports.modifyEmail = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  let act = req.body.act;
  // 获取当前用户的用户名
  let id = req.session.user.id;
  let email = req.body.email;
  let code;
  switch (act) {
    case 'modify':
      return user.modifyEmail(id, email)
      .then(function (ret) {
        // 修改了影响了登录的email，需重置session
        req.session.user.email = ret;
        return res.api('邮箱修改成功');
      })
      .catch(err => res.api_error(err.message));
    case 'bind':
      code = req.body.code;
      return user.bindEmail(id, email, code, true)
      .then(ret => res.api('邮箱验证绑定成功'))
      .catch(err => res.api_error(err.message));
    case 'unbind':
      code = req.body.code;
      return user.bindEmail(id, email, code, false)
      .then(ret => res.api('邮箱验证解绑成功'))
      .catch(err => res.api_error(err.message));
    default:
      return res.api(...status.apiNotFound);
  }
}

/**
 * 用户修改密码 - PUT
 * @param {Object} req.body
 * @param {String} req.body.password  - 新密码
 * @param {String} req.body.code
 * @param {Object} req.session.user
 * @param {String} req.session.user.email
 */
exports.modifyPassword = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  // 获取当前用户的用户名
  let email = req.session.user.email;
  let password = req.body.password;
  let code = req.body.code;
  return user.modifyPassword(email, password, code)
  .then(function (ret) {
    // 修改完不退出，即时更新其当前密码
    req.session.user.password = ret;
    return res.api('修改密码成功');
  })
  .catch(err => res.api_error(err.message));
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
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  let action = req.body.act;
  switch (action) {
    case 'follow':
      if (req.session.user.name === req.body.follow) {
        return res.api('不能关注自己');
      }
      return user.follow(req.body)
      .then(ret => res.api('关注成功'))
      .catch(err => res.api_error(err.message));
    case 'unfollow':
      return user.unfollow(req.body)
      .then(ret => res.api('取消关注成功'))
      .catch(err => res.api_error(err.message));
    case 'remark':
      return user.remark(req.body)
      .then(ret => res.api('修改备注成功'))
      .catch(err => res.api_error(err.message));
    case 'regroup':
      return user.regroup(req.body)
      .then(ret => res.api('编辑分组成功'))
      .catch(err => res.api_error(err.message));
    case 'black':
      return user.black(req.body)
      .then(ret => res.api('拉黑成功'))
      .catch(err => res.api_error(err.message));
    case 'unblack':
      return user.unblack(req.body)
      .then(ret => res.api('解除黑名单成功'))
      .catch(err => res.api_error(err.message));
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
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  let param = {action: req.body.act, id: req.session.user.id}
  return user.modifyWeiboCount(param)
  .then(ret => res.api('微博计数更新成功'))
  .catch(err => res.api_error(err.message));
}

/**
 * 用户新建分组 - POST
 * @param {Object} req.body
 * @param {String} req.body.name
 * @param {String} req.body.description 
 */
exports.addGroup = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  if (!req.body.name) {
    return res.api_error(...status.lackParams);
  }
  if (req.body.name === '未分组' || req.body.name === '黑名单') {
    return res.api_error('不可与固定分组重名');
  }
  return user.addGroup(req.body, req.session.user.id)
  .then(ret => res.api('新建分组成功'))
  .catch(err => res.api_error(err.message));
}


/**
 * 用户修改分组信息 - PUT
 * @param {Object} req.body
 * @param {Object} req.body.group -分组新信息
 * @param {String} req.body.old -分组旧id
 */
exports.modifyGroup = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  if (!req.body.old) {
    return res.api_error(...status.lackParams);
  }
  if (typeof req.body.group !== 'object') {
    try {
      req.body.group = JSON.parse(req.body.group);
    }
    catch (err) {
      return res.api_error('请规范传入的分组信息，不接收单引号，属性名请用双引号引出');
    }
  }
  if (req.body.group.name === '未分组' || req.body.group.name === '黑名单') {
    return res.api_error('不可与固定分组重名');
  }
  return user.modifyGroup(req.body.old, req.session.user.name, req.body.group)
  .then(ret => res.api('修改分组信息成功'))
  .catch(err => res.api_error(err.message));
}

/**
 * 用户删除分组 - DELETE
 * @param {Object} req.body
 * @param {String} req.body.gid -分组id
 */
exports.delGroup = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  return user.delGroup(req.query.gid, req.session.user.id)
  .then(ret => res.api('删除分组成功'))
  .catch(err => res.api_error(err.message));
}

/**
 * 用户获取个人信息 - GET
 * @param {Object} req.query
 * @param {Number} req.query.id
 */
exports.getInfo = function (req, res, next) {
  req.query.id = parseInt(req.query.id);
  return user.getInfo(req.query.id)
  .then(function (result) {
    if (req.session.user && req.query.id !== req.session.user.id) {
      return user.getRemark(req.session.user.id, req.query.id)
      .then(function (remark) {
        if (remark !== '' && remark !== null) {
          result.remark = remark;
        }
        return result;
      });
    }
    return result;
  })
  .then(ret => res.api(ret))
  .catch(err => res.api_error(err.message));
}

/**
 * 用户获取关注列表 - GET
 * @param {Object} req.query
 * @param {String} req.query.name
 */
exports.getFollow = function (req, res, next) {
  return user.getFollow(req.query.name)
  .then(ret => res.api(ret))
  .catch(err => res.api_error(err.message));
}

/**
 * 用户获取粉丝列表 - GET
 * @param {Object} req.query
 * @param {String} req.query.name
 */
exports.getFans = function (req, res, next) {
  return user.getFans(req.query.name)
  .then(ret => res.api(ret))
  .catch(err => res.api_error(err.message));
}

/**
 * 用户获取分组列表 - GET
 * @param {Object} req.query
 * @param {String} req.query.name
 */
exports.getGroups = function (req, res, next) {
  let where = {creator: req.query.name};
  if (req.query.name !== req.session.user.name) {
    where.public = true;
  }
  return user.getGroups(where)
  .then(ret => res.api(ret))
  .catch(err => res.api_error(err.message));
}

/**
 * 用户获取分组描述 - GET
 * @param {Object} req.query
 * @param {String} req.query.name
 * @param {String} req.query.group
 */
exports.getGroupDetail = function (req, res, next) {
  return user.getGroupDetail(req.query.name, req.query.group)
  .then(ret => res.api(ret))
  .catch(err => res.api_error(err.message));
}

/**
 * 用户获取分组成员 - GET
 * @param {Object} req.query
 * @param {String} req.query.name
 * @param {String} req.query.group
 */
exports.getGroupMember = function (req, res, next) {
  return user.getGroupMember(req.query.name, req.query.group)
  .then(ret => res.api(ret))
  .catch(err => res.api_error(err.message));
}