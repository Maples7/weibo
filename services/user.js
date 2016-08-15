/**
 * Created by Ming Tae on 2016/8/11
 */
const _ = require('lodash');
const Promise = require('bluebird');

const db = require('../models');
const encode = require('../tools/crypt').encodePassword;

exports.login = login;
exports.register = register;
exports.modifyInfo = modifyInfo;
exports.modifyPassword = modifyPassword;
exports.follow = follow;
exports.unfollow = unfollow;
exports.black = black;
exports.remark = remark;
exports.regroup = regroup;
exports.modifyWeiboCount = modifyWeiboCount;
exports.modifyGroup = modifyGroup;
exports.deleteGroup = deleteGroup;
exports.getInfo = getInfo;
exports.getFollow = getFollow;
exports.getFans = getFans;
exports.getGroup = getGroup;
exports.getRemark = getRemark;

/**
 * login 登录
 * @param userObj
 */
function login(userObj) {
  let password = encode(userObj);
  let where = {password: password};
  if (userObj.name) {
    where.name = userObj.name;
  }
  else {
    where.email = userObj.email;
  }

  return db.User.findOne(where);
}

/**
 * register 注册
 * @param userObj
 */
function register(userObj) {
  let password = encode(userObj);
  let defaults = {password: password};
  
  return db.User.findOne({where: {name: userObj.name}})
  .then(function (ret) {
    if (ret) {
      throw (new Error('用户名已被注册'));
    }
    else {
      return null;
    }
  })
  .then(function () {
    return db.User.findOne({where : {email: userObj.email}});
  })
  .then(function (ret) {
    if (ret) {
      throw (new Error('邮箱已被注册'));
    }
    else {
      return null;
    }
  })
  .then(function () {
    return db.User.create({
      name: userObj.name,
      email: userObj.email,
      password: password,
      headPic: userObj.headPic,
      bio: userObj.bio,
      sex: userObj.sex,
      createTime: Date.now() 
    });
  })
  .then(ret => db.Group.create({creator: userObj.name, name: '未分组'})
  .then(ret => db.Group.create({creator: userObj.name, name: '黑名单'})));
}

/**
 * modifyInfo 修改个人信息
 */
function modifyInfo(name, userObj) {
  return db.User.findOne({where: {name: name}})
  .then(function (ret) {
    let email = ret.email;
    return ret.updateAttributes(userObj)
    .then(function (r) {
      // 若用户名更改，需同时修改分组表、关注表
      if (userObj.name != name) {
        return db.Group.findAll({where : {creator: name}})
        .then(results => Promise.each(results, function(result) {
          result.updateAttributes({creator: userObj.name});
        }))
        .then(() => db.Relationship.findAll({where: {fans: name}}))
        .then(results => Promise.each(results, function(result) {
          result.updateAttributes({fans: userObj.name});
        }))
        .then(() => db.Relationship.findAll({where: {follow: name}}))
        .then(results => Promise.each(results, function(result) {
          result.updateAttributes({follow: userObj.name});
        }))
        .then(function () {
          // 若邮箱更改，置假邮箱验证属性
          if (userObj.email != email) {
            return ret.updateAttributes({emailConfirm: false})
            .then(() => ret);
          }
          return ret;
        });
      }
      else if (userObj.email != email) {
        return ret.updateAttributes({emailConfirm: false})
        .then(() => ret);
      }
      return '信息修改成功';
    });
  });
}

/**
 * modifyPassword 修改个人密码
 */
function modifyPassword(name, password) {
  let pass = encode(password);

  return db.User.findOne({where: {name: name}})
  .then(function (r) {
    r.updateAttributes({password: pass});
    return pass;
  });
}

/**
 * follow 关注
 * @param {String} req.
 */
function follow(info) {
  let groups = info.group.join(" ") || null;
  // 若被对方拉黑，则无法关注对方
  return db.Relationship.findOne({
    fans: info.follow,
    follow: info.fans
  })
  .then(function (ret) {
    if (ret.group === '黑名单') {
      throw (new Error('你已被对方拉黑，关注失败'));
    }
    return null;
  })
  // 更新发起关注方关注数
  .then(() => db.User.findOne({where: {name: info.fans}}))
  .then(() => ret.updateAttributes({followCount: ret.followCount + 1}))
  // 更新被关注方粉丝数
  .then(() => db.User.findOne({where: {name: info.follow}}))
  .then(() => ret.updateAttributes({fansCount: ret.fansCount + 1}))
  // 若被分到新分组，创建分组
  .then(() => Promise.each(groups, g => db.Group.findOrCreate({where: {creator: info.fans, name: g}})))
  // 根据分组信息创建关注记录
  .then(function () {
    if (_.isEmpty(groups)) {
      return db.Relationship.create({
        fans: req.body.fans,
        follow: req.body.follow,
        remark: req.body.remark || null,
        group: '未分组'
      });
    }
    return Promise.each(groups, function (group) {
      return db.Relationship.create({
        fans: req.body.fans,
        follow: req.body.follow,
        remark: req.body.remark || null,
        group: group
      });
    });
  });
}

/**
 * unfollow 取消关注
 */
function unfollow(info) {
  // 删除关注记录
  return db.Relationship.destroy({
    fans: info.fans,
    follow: info.follow
  })
  // 更新发起关注方关注数
  .then(ret => db.User.findOne({where: {name: info.fans}})
  .then(ret => ret.updateAttributes({followCount: ret.followCount - 1})))
  // 更新被关注方粉丝数
  .then(ret => db.User.findOne({where: {name: info.follow}})
  .then(ret => ret.updateAttributes({fansCount: ret.fansCount - 1})));
}

/**
 * remark 备注修改
 */
function change(info) {
  return db.Relationship.findAll({
    where: {
      fans: info.fans,
      follow: info.follow
    }
  })
  .then(rs => Promise.each(rs, r => r.updateAttributes({remark: info.remark})));
}

/**
 * regroup 分组修改
 */
function regroup(info) {
  // 先删除不在新分组列表中的记录
  return db.Relationship.findAll({
    where: {
      fans: info.fans,
      follow: info.follow
    }
  })
  .then(rs => Promise.each(rs, function(r) {
    if (!info.group.some(g => g === r)) {
      r.destroy();
    }
  }))
  // 再补上新分组列表中新分到的记录
  .then(function () {
    if (_.isEmpty(info.group)) {
      return db.Relationship.create({
        fans: info.fans,
        follow: info.follow,
        remark: info.remark,
        group: null
      });
    }
    return Promise.each(info.group, g => db.Relationship.findOrCreate({
      fans: info.fans,
      follow: info.follow,
      remark: info.remark || null,
      group: g
    }));
  })
}

/**
 * black 拉黑
 */
function black(info) {
  return db.Relationship.findAll({
    where: {
      fans: info.fans,
      follow: info.follow
    }
  })
  .then(function (rs) {
    // 若要拉黑已关注的人，先修改双方关注/粉丝数
    if (!_.isEmpty(rs)) {
      // 更新发起关注方关注数
      return db.User.findOne({where: {name: fans}})
      .then(ret => ret.updateAttributes({followCount: ret.followCount - 1}))
      // 更新被关注方粉丝数
      .then(ret => db.User.findOne({where: {name: follow}})
      .then(ret => ret.updateAttributes({fansCount: ret.fansCount - 1})))
      // 删除关注记录
      .then(function () {
        return Promise.each(rs, r => ret.destroy());
      });
    }
  })
  // 创建黑名单记录
  .then(function () {
    return db.Relationship.create({
      fans: info.fans,
      follow: info.follow,
      group: '黑名单'
    });
  })
  // 把被拉黑者对拉黑者的关注删除
  .then(function () {
    return db.Relationship.destroy({
      fans: info.follow,
      follow: info.fans
    });
  });
}

/**
 * modifyWeiboCount 更新微博数
 */
function modifyWeiboCount(param) {
  return db.User.findOne({where: {name: param.name}})
  .then(function (ret) {
    if (param.action === 'add') {
      ret.updateAttributes({weiboWeibo: ret.weiboWeibo + 1});
    }
    else if (param.action === 'del') {
      ret.updateAttributes({weiboWeibo: ret.weiboWeibo - 1});
    }
    else {
      throw (new Error('更新微博数参数错误'));
    }
  });
}

/**
 * modifyGroup 更新分组信息
 * @param {String} name
 * @param {String} oldGroup
 * @param {Object} newGroup
 */
function modifyGroup(old, creator, group) {
  // 更新分组列表里该分组信息
  return db.Group.findOne({
    where: {
      name: old,
      creator: creator
    }
  })
  .then(ret => ret.updateAttributes(group))
  // 更新关注列表里该分组组名
  .then(function() {
    return db.Relationship.find({
      where: {
        fans: creator,
        group: old
      }
    });
  })
  .then(results => Promise.each(results, function(result) {
    return result.updateAttributes({group: group.name});
  }));
}

/**
 * deleteGroup 删除分组
 */
function deleteGroup(creator, group) {
  // 删除分组列表里该分组
  return db.Group.destroy({
    where: {
      creator: creator,
      group: group
    }
  })
  .then(function (ret) {
    // 关注列表里删除分组
    return db.Relationship.find({
      where: {
        fans: creator,
        group: group
      }
    })
    .then(results => Promise.each(results, function(result) {
      // 若某被关注者仅被分到该分组，则分到'未分组'
      return db.Relationship.count({
        where: {
          fans: creator,
          follow: result
        }
      })
      .then(function (num) {
        if (num === 1) {
          result.updateAttributes({group: '未分组'});
        }
        else {
          result.destroy();
        }
      });
    }));
  });
}

/**
 * getInfo 获取个人信息
 */
function getInfo(name) {
  return db.User.findOne({where: {name: name}})
  .then(ret => ret)
  .catch(err => err);
}

/**
 * getRemark 获取备注名
 */
function getRemark(fans, follow) {
  return db.Relationship.findOne({where: {fans: fans, follow: follow}})
  .then(ret => ret.remark)
  .catch(err => err);
}

/**
 * getFollow 获取关注列表
 */
function getFollow(name) {
  return db.Relationship.findAll({where: {fans: name}})
  .then(ret => _.uniqBy(ret, 'follow'))
  .catch(err => err);
}

/**
 * getFans 获取粉丝列表
 */
function getFans(name) {
  return db.Relationship.findAll({where: {follow: name}})
  .then(ret => _.uniqBy(ret, 'fans'))
  .catch(err => err);
}

/**
 * getGroups 获取分组列表
 */
function getGroups(name) {
  return db.Group.findAll({where: {creator: name}})
  .then(ret => ret)
  .catch(err => err);
}

/**
 * getGroupDetail 获取分组详情
 */
function getGroupDetail(name, group) {
  return db.Group.findOne({where: {creator: name, name: group}})
  .then(ret => ret)
  .catch(err => err);
}

/**
 * getGroupMember 获取分组成员
 */
function getGroupMember(name, group) {
  return db.Relationship.findAll({where: {fans: name, group: group}})
  .then(ret => ret)
  .catch(err => err);
}