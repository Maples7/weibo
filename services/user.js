/**
 * Created by Ming Tse on 2016/8/11
 */
const _ = require('lodash');
const Promise = require('bluebird');
const nodemailer = require('nodemailer');
const sendmailOpt = {
  host: 'smtp.163.com',
  port: 465,
  ignoreTLS: true,
  auth: {
    user: 'bobmingxie@163.com',
    pass: 'ourweibo2016'
  }
}
const transporter = nodemailer.createTransport(sendmailOpt);

const db = require('../models').models;
const encode = require('../tools/crypt').encodePassword;

exports.sendMail = sendMail;
exports.saveCode = saveCode;
exports.login = login;
exports.register = register;
exports.modifyInfo = modifyInfo;
exports.modifyEmail = modifyEmail;
exports.bindEmail = bindEmail;
exports.modifyPassword = modifyPassword;
exports.follow = follow;
exports.unfollow = unfollow;
exports.remark = remark;
exports.regroup = regroup;
exports.black = black;
exports.unblack = unblack;
exports.modifyWeiboCount = modifyWeiboCount;
exports.addGroup = addGroup;
exports.modifyGroup = modifyGroup;
exports.delGroup = delGroup;
exports.getInfo = getInfo;
exports.getRemark = getRemark;
exports.getFollow = getFollow;
exports.getFans = getFans;
exports.getGroups = getGroups;
exports.getGroupDetail = getGroupDetail;
exports.getGroupMember = getGroupMember;

/**
 * sendMail 发送邮件
 */
function sendMail(username, useremail, code, callback) {
  let content = 'Hi, ' + username + ': \n\t' +
  '欢迎使用微博服务，您的验证码是：\n\t' +
  code + '\n\t' + '请尽快完成邮箱验证\n' +
  '[微博团队]';
  let mailContent = {
    from : 'bobmingxie@163.com',
    to : useremail,
    subject : "微博邮箱验证",
    nick: "微博<bobmingxie@163.com>",
    text : content
  };
  transporter.sendMail(mailContent, function (err, info) {
    if (err) {
      console.log(err);
      return callback('邮件发送失败');
    }
    else {
      return callback();
    }
  });
}

/**
 * saveCode 保存验证码
 */
function saveCode(useremail, code) {
  return db.Code.create({email: useremail, code: code});
}

/**
 * login 登录
 * @param userObj
 */
function login(userObj) {
  let password = encode(userObj.password);
  let where = {password: password};
  if (userObj.name) {
    where.name = userObj.name;
    return db.User.findOne({where: where});
  }
  else {
    where.email = userObj.email;
    return db.User.findOne({where: where})
    .then(function (ret) {
      if (!ret.dataValues.emailConfirm) {
        throw new Error('邮箱未绑定，请用用户名登录');
      }
      return ret;
    });
  }
}

/**
 * register 注册
 * @param userObj
 */
function register(userObj) {
  let password = encode(userObj.password);
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
function modifyInfo(uid, userObj) {
  return db.User.update(userObj, {where: {uid: uid}, returning: true})
  .then(function (ret) {
    if (ret[0]) {
      return ret[1];
    }
    else {
      throw new Error('修改信息失败');
    }
  });
}

/**
 * modifyEmail 修改个人邮箱
 */
function modifyEmail(uid, email) {
  return db.User.findOne({where: {uid: uid}})
  .then(function (ret) {
    if (ret.emailConfirm) {
      throw new Error('邮箱已绑定，请解绑后修改');
    }
    return ret.updateAttributes({email: email});
  });
}

/**
 * bindEmail 绑定/解绑邮箱
 */
function bindEmail(uid, email, code, flag) {
  return db.Code.findOne({where: {email: email, code: parseInt(code)}})
  .then(function (ret) {
    if (ret) {
      if (Date.now() - ret.createTime > 3600 * 5) {
        return ret.destroy().then(() => {throw new Error('验证码已过期')});
      }
      return db.User.findOne({where: {uid: uid, email: email}})
      .then(r => r.updateAttributes({emailConfirm: flag}))
      .then(() => ret.destroy());
    }
    else {
      throw new Error('验证码错误');
    }
  });
}

/**
 * modifyPassword 修改个人密码
 */
function modifyPassword(email, password, code) {
  let pass = encode(password);
  return db.Code.findOne({where: {email: email, code: code}})
  .then(function (ret) {
    if (ret) {
      if (Date.now() - ret.createTime > 3600 * 5) {
        return ret.destroy().then(() => {throw new Error('验证码已过期')});
      }
      return ret.destroy()
      .then(() => db.User.findOne({where: {email: email}}))
      .then(r => r.updateAttributes({password: pass}))
      .then(() => pass);
    }
    else {
      throw new Error('验证码错误');
    }
  });
}

/**
 * follow 关注
 * @param {String} req.
 */
function follow(info) {
  let groups = [];
  if (typeof info.groups !== 'object') {
    try {
      groups = JSON.parse(info.groups);
    }
    catch (err) {
      return Promise.reject('请规范传入的分组信息，不接收单引号，属性名请用双引号引出');
    }
  }
  // 若被对方拉黑，则无法关注对方
  return db.Relationship.findOne({
    where: {
      fans: info.follow,
      follow: info.fans
    }
  })
  .then(function (ret) {
    if (ret && ret.group === '黑名单') {
      throw new Error('你已被对方拉黑，关注失败');
    }
    return db.Relationship.findOne({
      where: {
        fans: info.fans,
        follow: info.follow
      }
    });
  })
  .then(function (ret) {
    if (ret.group !== '黑名单') {
      throw new Error('你已关注对方');
    }
  })
  // 更新发起关注方关注数
  .then(() => db.User.findOne({where: {name: info.fans}}))
  .then((ret) => ret.updateAttributes({followCount: ret.followCount + 1}))
  // 更新被关注方粉丝数
  .then(() => db.User.findOne({where: {name: info.follow}}))
  .then((ret) => ret.updateAttributes({fansCount: ret.fansCount + 1}))
  // 若被分到新分组，创建分组
  .then(() => Promise.each(groups, g => db.Group.findOrCreate({where: {creator: info.fans, name: g}})))
  // 根据分组信息创建关注记录
  .then(function () {
    if (_.isEmpty(groups)) {
      return db.Relationship.create({
        fans: info.fans,
        follow: info.follow,
        remark: info.remark || null
      });
    }
    return Promise.each(groups, function (group) {
      db.Relationship.create({
        fans: info.fans,
        follow: info.follow,
        remark: info.remark || null,
        group: group
      });
    });
  })
  .then(function () {
    return db.Relationship.destroy({
      where: {
        fans: info.fans,
        follow: info.follow,
        group: '黑名单'
      }
    });
  });
}

/**
 * unfollow 取消关注
 */
function unfollow(info) {
  // 删除关注记录
  return db.Relationship.destroy({
    where: {
      fans: info.fans,
      follow: info.follow,
      group: {$ne: '黑名单'}
    }
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
function remark(info) {
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
  if (typeof info.groups !== 'object') {
    try {
      info.groups = JSON.parse(info.groups);
    }
    catch (err) {
      return Promise.reject('请规范传入的分组信息，不接收单引号，属性名请用双引号引出');
    }
  }
  var remark;
  // 先删除不在新分组列表中的记录
  return db.Relationship.findAll({
    where: {
      fans: info.fans,
      follow: info.follow
    }
  })
  .then(rs => Promise.each(rs, function(r) {
    remark = info.remark;
    if (_.indexOf(info.groups, r) === -1) {
      r.destroy();
    }
  }))
  // 若被分到新分组，创建分组
  .then(() => Promise.each(groups, g => db.Group.findOrCreate({where: {creator: info.fans, name: g}})))
  // 再补上新分组列表中新分到的记录
  .then(function () {
    if (_.isEmpty(info.groups)) {
      return db.Relationship.create({
        fans: info.fans,
        follow: info.follow,
        remark: remark
      });
    }
    return Promise.each(info.groups, g => db.Relationship.findOrCreate({
      where: {
        fans: info.fans,
        follow: info.follow,
        group: g
      },
      defaults: {
        remark: remark
      }
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
    if (rs.length === 1 && rs[0].group === '黑名单') {
      throw new Error('你已拉黑对方');
    }
    // 若要拉黑已关注的人，先修改双方关注/粉丝数
    if (!_.isEmpty(rs)) {
      // 更新发起关注方关注数
      return db.User.findOne({where: {name: info.fans}})
      .then(ret => ret.updateAttributes({followCount: ret.followCount - 1}))
      // 更新被关注方粉丝数
      .then(ret => db.User.findOne({where: {name: info.follow}})
      .then(ret => ret.updateAttributes({fansCount: ret.fansCount - 1})))
      // 删除关注记录
      .then(function () {
        return Promise.each(rs, r => r.destroy());
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
      where:{
        fans: info.follow,
        follow: info.fans
      }
    });
  });
}

/**
 * unblack 解除黑名单
 */
function unblack(info) {
  // 删除拉黑记录
  return db.Relationship.destroy({
    where: {
      fans: info.fans,
      follow: info.follow,
      group: '黑名单'
    }
  });
}

/**
 * modifyWeiboCount 更新微博数
 */
function modifyWeiboCount(param) {
  return db.User.findOne({
    where: {uid: param.uid},
    transaction: param.t
  })
  .then(function (ret) {
    if (param.action === 'add') {
      return ret.updateAttributes(
        {weiboCount: ret.weiboCount + 1},
        {transaction: param.t}
      );
    }
    else if (param.action === 'del') {
      return ret.updateAttributes(
        {weiboCount: ret.weiboCount - 1},
        {transaction: param.t}
      );
    }
    else {
      throw new Error('更新微博数参数错误');
    }
  });
}

/**
 * addGroup 新建分组
 * @param {Object} group
 * @param {String} creator
 */
function addGroup(group, creator) {
  return db.Group.findOrCreate({
    where: {
      name: group.name,
      creator: creator
    },
    defaults: {
      description: group.description || null,
      public: group.public
    }
  })
  .then(function (ret) {
    if (!ret[1]) {
      throw new Error('此分组名已存在');
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
  return db.Group.findOne({
    where: {
      name: group.name,
      creator: creator
    }
  })
  .then(function (ret) {
    if (ret && old !== group.name) {
      throw new Error('分组名已被使用');
    }
    // 更新分组列表里该分组信息
    return db.Group.findOne({
      where: {
        gid: old,
        creator: creator,
        name: {$notIn: ['未分组', '黑名单']}
      }
    });
  })
  .then(function (ret) {
    if (!ret) {
      throw new Error('原分组信息有误，未找到该分组');
    }
    return ret.updateAttributes(group);
  });
}

/**
 * deleteGroup 删除分组
 */
function delGroup(gid, creator) {
  // 删除分组列表里该分组
  return db.Group.destroy({
    where: {
      creator: creator,
      gid: gid,
      name: {$notIn: ['未分组', '黑名单']}
    }
  })
  .then(function (ret) {
    if (!ret) {
      throw new Error('此分组不存在');
    }
    // 关注列表里删除分组
    return db.Relationship.destroy({
      where: {
        fans: creator,
        group: gid
      }
    });
  });
}

/**
 * getInfo 获取个人信息
 */
function getInfo(id) {
  return db.User.findOne({where: {id: id}})
  .then(ret => ret.dataValues)
  .catch(err => err);
}

/**
 * getRemark 获取备注名
 */
function getRemark(fans, follow) {
  return db.Relationship.findOne({where: {fans: fans, follow: follow}})
  .then(ret => ret ? ret.dataValues.remark : '')
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
function getGroups(where) {
  return db.Group.findAll({where: where})
  .then(ret => {ret.push('未分组', '黑名单'); return ret;})
  .catch(err => err);
}

/**
 * getGroupDetail 获取分组详情
 */
function getGroupDetail(uid, gid) {
  return db.Group.findOne({where: {gid: gid}})
  .then(ret => {
    if (!ret) {
      throw new Error('该分组不存在');
    }
    if (ret.creator !== uid && !ret.public) {
      throw new Error('您无权查看该分组');
    }
    return ret;
  })
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