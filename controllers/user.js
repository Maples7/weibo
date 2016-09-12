/**
 * Created by Ming Tse on 2016/8/11
 */

const _ = require('lodash');
const Promise = require('bluebird');

const user = require('../services/user');
const status = require('../enums/resStatus');
const verifyEmail = require('../tools/verifyEmail');
const aCode = require('../tools/code');

/**
 * @api {post} /register 用户注册
 * @apiName PostUserRegister
 * @apiGroup User
 * @apiPermission anyone
 * @apiVersion 0.0.1 
 * 
 * @apiParam {String{1..20}}      name
 * @apiParam {String{1..50}}      email
 * @apiParam {String{6..30}}      password
 * @apiParam {String}             [headPic]     用户头像
 * @apiParam {Number=0,1}         [sex]         性别，0男1女，默认为null
 * @apiParam {String{0..200}}     [bio]         用户简介
 * 
 * @apiUse OperationSuccess
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
  if (verifyEmail(userObj.name)) {
    return res.api_error('请勿用邮箱命名用户名');
  }

  userObj.sex = req.body.sex || null;
  userObj.bio = req.body.bio || '这家伙很懒，什么也没写';
  userObj.headPic = req.body.headPic || '';

  user.register(userObj)
  .then(ret=> res.api('注册成功'))
  .catch(err => res.api_error(err.message));
};

/**
 * @api {post} /login 用户登录
 * @apiName PostUserLogin
 * @apiGroup User
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiParam {String{1..50}} account 用户名或邮箱
 * @apiParam {String{6..30}} password
 * 
 * @apiUse OperationSuccess
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
      return res.api_error('账号或密码错误');
    }
    req.session.user = ret.dataValues;
    return res.api('登录成功');
  })
  .catch(err => res.api_error(err.message));
};

/**
 * @api {get} /logout 用户登出
 * @apiName GetUserLogout
 * @apiGroup User
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiUse OperationSuccess
 */
exports.logout = function (req, res, next) {
  req.session.destroy();
  res.clearCookie(req.query.name);
  return res.api('登出成功');
};

/**
 * @api {put} /users/info 修改用户信息
 * @apiName PutUserInfo
 * @apiGroup User
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiParam {String{1..20}}    [name]      修改后的用户名
 * @apiParam {String}           [headPic]   头像URL
 * @apiParam {Boolean}          [sex]       性别
 * @apiParam {String{0..200}}   [bio]       个人简介
 * 
 * @apiUse OperationSuccess
 */
exports.modifyInfo = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  } // check.checkLogin
  if (req.session.user.id !== id) {
    return res.api_error('您无权修改他人信息');
  }
  let uid = req.session.user.id;
  return user.modifyInfo(uid, req.body)
  .then(function (ret) {
    req.session.user = ret;
    return res.api('信息修改成功');
  })
  .catch(err => res.api_error(err.message));
}

/**
 * @api {get} /users/needmail 发起发送邮箱请求
 * @apiName GetUserEmail
 * @apiGroup User
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiUse OperationSuccess
 */
exports.sendMail = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  } // check.checkLogin
  let name = req.session.user.name;
  let email = req.query.email;
  let code = aCode();
  return Promise.promisify(user.sendMail)(name, email, code)
  .then(() => user.saveCode(email, code))
  .then(() => res.api('邮件发送成功'))
  .catch(err => res.api_error(err.message));
}

/**
 * @api {put} /users/email 用户验证邮箱
 * @apiName PutUserEmail
 * @apiGroup User
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiParam {String} id
 * @apiParam {String} act='modify','bind','unbind' 修改/绑定/解绑
 * @apiParam {String{1..50}} email 修改时为新邮箱，绑定/解绑时为旧邮箱
 * @apiParam {String{6..6}} code 6位验证码   
 * 
 * @apiUse OperationSuccess
 */
exports.modifyEmail = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  let act = req.body.act;
  // 获取当前用户的用户名
  let uid = req.session.user.id;
  let email = req.body.email;
  let code;
  switch (act) {
    case 'modify':
      return user.modifyEmail(uid, email)
      .then(function (ret) {
        // 修改了影响了登录的email，需重置session
        req.session.user.email = ret;
        return res.api('邮箱修改成功');
      })
      .catch(err => res.api_error(err.message));
    case 'bind':
      code = req.body.code;
      return user.bindEmail(uid, email, code, true)
      .then(ret => res.api('邮箱验证绑定成功'))
      .catch(err => res.api_error(err.message));
    case 'unbind':
      code = req.body.code;
      return user.bindEmail(uid, email, code, false)
      .then(ret => res.api('邮箱验证解绑成功'))
      .catch(err => res.api_error(err.message));
    default:
      return res.api(...status.apiNotFound);
  }
}

/**
 * @api {put} /users/password 用户修改密码
 * @apiName PutUserPassword
 * @apiGroup User
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiParam {String{6..30}} password  新密码
 * @apiParam {String{6..6}} code
 * 
 * @apiUse OperationSuccess
 */
exports.modifyPassword = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  // 获取当前用户的邮箱
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
 * @apiIgnore
 * @api {put} /users/relationship 用户修改关注表
 * @apiName PutUserRelationship
 * @apiGroup User
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiParam {String} fans
 * @apiParam {String} follows
 * @apiParam {String} [remark] 备注名
 * @apiParam {String} [group]  分组数组
 */
exports.modifyRelationship = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  if (req.session.user.id === req.body.follow || req.session.user.id === req.body.fans) {
    return res.api_error('不能对自己进行关系操作');
  }
  let action = req.body.act;
  switch (action) {
    case 'follow':
      req.body.fans = req.session.user.id;
      return user.follow(req.body)
      .then(ret => res.api('关注成功'))
      .catch(err => res.api_error(err.message));
    case 'unfollow':
      req.body.fans = req.seesion.user.id;
      return user.unfollow(req.body)
      .then(ret => res.api('取消关注成功'))
      .catch(err => res.api_error(err.message));
    case 'remark':
      req.body.fans = req.session.user.id;
      if (req.session.user.id === req.body.follow) {
        return res.api_error('不能给自己设置备注');
      }
      req.body.fans = req.seesion.user.id;
      return user.remark(req.body)
      .then(ret => res.api('修改备注成功'))
      .catch(err => res.api_error(err.message));
    case 'regroup':
      req.body.fans = req.session.user.id;
      return user.regroup(req.body)
      .then(ret => res.api('编辑分组成功'))
      .catch(err => res.api_error(err.message));
    case 'black':
      req.body.fans = req.session.user.id;
      return user.black(req.body)
      .then(ret => res.api('拉黑成功'))
      .catch(err => res.api_error(err.message));
    case 'unblack':
      req.body.fans = req.session.user.id;
      return user.unblack(req.body)
      .then(ret => res.api('解除黑名单成功'))
      .catch(err => res.api_error(err.message));
    case 'remove':
      req.body.follow = req.session.user.id;
      return user.remove(req.body)
      .then(ret => res.api('移除粉丝成功'))
      .catch(err => res.api_error(err.message));
    default:
      return res.api(...status.apiNotFound);
  }
}

/**
 * 用户修改微博数 - PUT
 * @apiParam {Object} req.body
 * @apiParam {String} req.body.act
 * @apiParam {String} req.body.name
 */
exports.modifyWeiboCount = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  let param = {
    action: req.body.act,
    uid: req.session.user.id,
    time: req.body.time,
    t: req.body.t
  };
  return user.modifyWeiboCount(param)
  .then(ret => res.api('微博计数更新成功'))
  .catch(err => res.api_error(err.message));
}

/**
 * @api {post} /users/addgroup 用户新建分组
 * @apiName PostUserGroup
 * @apiGroup User
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiParam {String} name 新分组名
 * @apiParam {String} [description]
 * @apiParam {Boolean} [public] 分组公开性
 * 
 * @apiUse OperationSuccess
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
 * @api {put} /users/modgroup 修改分组信息
 * @apiName PutUserGroup
 * @apiGroup User
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiParam {Object} group {"name": 分组新名, "description": 分组新描述, "public": 分组公开性}
 * @apiParam {Number} old 要被修改的分组id
 * 
 * @apiUse OperationSuccess
 */
exports.modifyGroup = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  if (typeof req.body !== 'object') {
    try {
      req.body = JSON.parse(req.body);
    }
    catch (err) {
      return res.api_error('请规范传入的分组信息，不接收单引号，属性名请用双引号引出');
    }
  }
  if (req.body.name === '未分组' || req.body.name === '黑名单') {
    return res.api_error('不可与固定分组重名');
  }
  return user.modifyGroup(req.body, req.session.user.id, req.params.gid)
  .then(ret => res.api('修改分组信息成功'))
  .catch(err => res.api_error(err.message));
}

/**
 * @api {put} /users/delgroup 删除分组
 * @apiName DelUserGroup
 * @apiGroup User
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiParam {number} gid 要被删除的分组id
 * 
 * @apiUse OperationSuccess
 */
exports.delGroup = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再修改信息');
  }
  return user.delGroup(req.params.gid, req.session.user.id)
  .then(ret => res.api('删除分组成功'))
  .catch(err => res.api_error(err.message));
}

/**
 * @api {get} /users/:id 通过id获取用户信息
 * @apiName GetUserInfoById
 * @apiGroup User
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiParam {Number} id 被查询用户id
 * 
 * @apiUse OperationSuccess
 */
exports.getInfo = function (req, res, next) {
  let id = parseInt(req.params.id);
  return user.getInfo(id)
  .then(function (result) {
    if (req.session.user && id !== req.session.user.id) {
      return user.getRemark(req.session.user.id, id)
      .then(function (results) {
        if (results.remark !== '' && results.remark !== null) {
          result.remark = results.remark;
        }
        if (results.groups.length) {
          result.groups = results.groups;
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
 * @api {get} /users/name/:name 通过用户名获取用户信息
 * @apiName GetUserInfoByName
 * @apiGroup User
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiParam {Number} id 被查询用户id
 * 
 * @apiUse OperationSuccess
 */
exports.getInfoByName = function (req, res, next) {
  let name = req.params.name;
  return user.getInfoByName(name)
  .then(function (result) {
    if (req.session.user && name !== req.session.user.name) {
      return user.getRemark(req.session.user.id, result.id)
      .then(remark => {
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
 * @api {get} /users/acc/:acc 通过用户名或备注获取用户信息
 */
exports.getInfoByAcc = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后查找好友');
  }
  let acc = req.params.acc;
  let range = req.query.range;
  return user.getInfoByAcc(acc, req.session.user.id, range)
  .then(function (results) {
    return Promise.map(results, r => {
      return user.getRemark(req.session.user.id, r.id)
      .then(remark => {
        if (!remark) {
          r.remark = remark;
        }
        return null;
      });
    });
  })
  .then(ret => res.api(ret))
  .catch(err => res.api_error(err.message));
}

/**
 * 批量管理 - PUT
 */
exports.batchManage = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.api_error('请登录后再批量管理');
  }
  let act = req.body.act;
  let follows = req.body.follows;
  let fans = req.session.user.id;
  switch (act) {
    case 'regroup':
      let groups = req.body.groups;
      for (let i = 0;i < follows.length;i++) {
        follows[i] = {fans: fans, follow: follows[i], groups: groups};
      }
      return Promise.map(follows, follow => user.regroup(follow))
      .then(() => res.api('批量改组成功'))
      .catch(err => res.api_error(err.message));
    case 'unfollow':
      for (let i = 0;i < follows.length;i++) {
        follows[i] = {fans: fans, follow: follows[i]};
      }
      return Promise.map(follows, follow => user.unfollow(follow))
      .then(() => res.api('批量取关成功'))
      .catch(err => res.api_error(err.message));
    default :
      return res.api_error('未知操作');
  }
}

/**
 * 用户获取关注列表 - GET
 * @apiParam {String} req.query.name
 */
exports.getFollow = function (req, res, next) {
  let id = req.params.id;
  let sort = req.query.sort;
  let page = req.query.page - 1 || 0;
  let limit = 30;
  return user.getFollow(id, sort)
  .then(ret => res.api({
    follow: ret.slice(page * limit, (page + 1) * limit),
    total: Math.ceil(ret.length / limit) 
  }))
  .catch(err => res.api_error(err.message));
}

/**
 * 用户获取粉丝列表 - GET
 * @apiParam {String} req.query.name
 */
exports.getFans = function (req, res, next) {
  let id = req.params.id;
  let sort = req.query.sort;
  let page = req.query.page - 1 || 0;
  let limit = 30;
  return user.getFans(id, sort)
  .then(ret => res.api({
    fans: fans.slice(page * limit, (page + 1) * limit),
    total: Math.ceil(fans.length / limit) 
  }))
  .catch(err => res.api_error(err.message));
}

/**
 * 用户获取分组列表 - GET
 * @apiParam {String} req.query.name
 */
exports.getGroups = function (req, res, next) {
  let id = parseInt(req.params.id);
  let where = {creator: id};
  if (req.params.id !== req.session.user.id) {
    where.public = true;
  }
  return user.getGroups(where)
  .then(ret => res.api(ret))
  .catch(err => res.api_error(err.message));
}

/**
 * 用户获取分组描述 - GET
 * @apiParam {String} req.query.name
 * @apiParam {String} req.query.group
 */
exports.getGroupDetail = function (req, res, next) {
  if (!req.session || !req.session.user) {
    throw new Error('请登录后查看分组');
  }
  return user.getGroupDetail(req.session.user.id, req.params.gid)
  .then(ret => res.api(ret))
  .catch(err => res.api_error(err.message));
}

/**
 * 用户获取分组成员 - GET
 * @apiParam {String} req.query.name
 * @apiParam {String} req.query.group
 */
exports.getGroupMember = function (req, res, next) {
  let member = [];
  let page = req.query.page - 1 || 0;
  let limit = 30;
  let params = {id: req.params.gid};
  if (!req.session || !req.seesion.user || req.seesion.user.id != req.params.id) {
    params.public = true;
  }
  return user.getGroupMember(params)
  .then(ret => Promise.each(ret, r => {
    return getInfo(r.follow).then(re => common.push(re));
  }))
  .then(() => res.api({
    total: Math.ceil(common.length / limit),
    member: common.slice(page * limit, (page + 1) * limit)
  }))
  .catch(err => res.api_error(err.message));
}

/**
 * 获取与目标用户的共同关注 - GET
 */
exports.getCommonFollow = function (req, res, next) {
  if (!req.session || !req.session.user) {
    throw new Error('请登录后查看共同关注');
  }
  let id = req.session.user.id;
  let uid = req.params.id;
  let page = req.query.page - 1 || 0;
  let limit = 30;
  let common = [];
  return user.getCommonFollow(id, uid, page)
  .then(ret => Promise.each(ret, r => {
    return getInfo(r).then(re => common.push(re));
  }))
  .then(() => res.api({
    total: Math.ceil(common.length / limit),
    common: common.slice(page * limit, (page + 1) * limit)
  }))
  .catch(err => res.api_error(err.message));
}

/**
 * 获取与目标用户的共同关注 - GET
 */
exports.getCommonFans = function (req, res, next) {
  if (!req.session || !req.session.user) {
    throw new Error('请登录后查看共同粉丝');
  }
  let id = req.session.user.id;
  let uid = req.params.id;
  let page = req.query.page - 1 || 0;
  let limit = 30;
  let common = [];
  return user.getCommonFans(id, uid, page)
  .then(ret => Promise.each(ret, r => {
    return getInfo(r).then(re => common.push(re));
  }))
  .then(() => res.api({
    total: Math.ceil(common.length / limit),
    common: common.slice(page * limit, (page + 1) * limit)
  }))
  .catch(err => res.api_error(err.message));
}

/**
 * 获取自己的黑名单 - GET
 */
exports.getBlack = function (req, res, next) {
  if (!req.session || !req.session.user) {
    throw new Error('请登录后查看黑名单');
  }
  let id = req.session.user.id;
  let page = req.params.id;
  let limit = 30;
  let black = [];
  return user.getBlack(id)
  .then(ret => Promise.each(ret, r => {
    return getInfo(r).then(re => black.push(re));
  }))
  .then(() => res.api({
    total: Math.ceil(black.length / limit),
    black: black.slice(page * limit, (page + 1) * limit)
  }))
  .catch(err => res.api_error(err.message));
}
