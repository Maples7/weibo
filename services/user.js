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
exports.remove = remove;
exports.outgroup = outgroup;
exports.modifyWeiboCount = modifyWeiboCount;
exports.addGroup = addGroup;
exports.modifyGroup = modifyGroup;
exports.delGroup = delGroup;
exports.getInfo = getInfo;
exports.getInfoByName = getInfoByName;
exports.getInfoByAcc = getInfoByAcc;
exports.getRemark = getRemark;
exports.getFollow = getFollow;
exports.getFans = getFans;
exports.getBlack = getBlack;
exports.getGroups = getGroups;
exports.getGroupDetail = getGroupDetail;
exports.getGroupMember = getGroupMember;
exports.getCommonFollow = getCommonFollow;
exports.getCommonFans = getCommonFans;
exports.getEachOther = getEachOther; // 互粉状态

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
  });
  // .then(ret => db.Group.create({creator: ret.id, name: '全部关注'}).then(() => ret))
  // .then(ret => db.Group.create({creator: ret.id, name: '未分组'}).then(() => ret))
  // .then(ret => db.Group.create({creator: ret.id, name: '黑名单'}));
}

/**
 * modifyInfo 修改个人信息
 */
function modifyInfo(id, userObj) {
  return db.User.update(userObj, {where: {id: id}, returning: true});
}

/**
 * modifyEmail 修改个人邮箱
 */
function modifyEmail(id, email) {
  return db.User.findOne({where: {id: id}})
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
function bindEmail(id, email, code, flag) {
  return db.Code.findOne({where: {email: email, code: parseInt(code)}})
  .then(function (ret) {
    if (ret) {
      if (Date.now() - ret.dataValues.createTime > 60000 * 15) {
        return ret.destroy().then(() => {throw new Error('验证码已过期')});
        // throw new Error('验证码已过期');
      }
      return db.User.findOne({where: {id: id, email: email}})
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
      if (Date.now() - ret.dataValues.createTime > 60000 * 15) {
        return ret.destroy().then(() => {throw new Error('验证码已过期')});
        // throw new Error('验证码已过期');
      }
      return ret.destroy()
      .then(() => db.User.findOne({where: {email: email}}))
      .then(r => r.updateAttributes({password: pass, emailConfirm: true}))
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
  // if (typeof info.groups !== 'object') {
  //   try {
  //     groups = JSON.parse(info.groups);
  //   }
  //   catch (err) {
  //     return Promise.reject('请规范传入的分组信息，不接收单引号，属性名请用双引号引出');
  //   }
  // }
  // 若被对方拉黑，则无法关注对方
  return db.Black.findOne({where: {fans: info.follow, follow: info.fans}})
  .then(one => {
    if (one) {
      throw new Error('你已被对方拉黑，关注失败');
    }
    return db.Black.findOne({where: {fans: info.fans, follow: info.follow}});
  })
  .then(one => {
    if (one) {
      throw new Error('你已拉黑对方，请先将其移出黑名单');
    }
    return db.Nexus.findOne({where: {fans: info.fans, follow: info.follow}});
  })
  .then(one => {
    if (one) {
      throw new Error('你已关注对方');
    }
    return db.Nexus.create({fans: info.fans, follow: info.follow, toGroup: false});
  })
  .then(() => updateGroupsCount(info.fans)) // 更新关注方未分组成员数
  .then(() => updateFollowCount(info.fans)) // 更新关注方关注数
  .then(() => updateFansCount(info.follow));  // 更新被关注方粉丝数
}

/**
 * unfollow 取消关注
 */
function unfollow(info) {
  // 删除关注记录
  return db.Nexus.destroy({where: {fans: info.fans, follow: info.follow}})
  .then(count => {
    if (!count) {
      throw new Error('你未关注对方，无需取消关注');
    }
    return ;
  })
  .then(() => db.Relationship.destroy({where: {fans: info.fans, follow: info.follow}}))
  .then(() => updateGroupsCount(info.fans)) // 更新关注方各分组成员数
  .then(() => updateFollowCount(info.fans)) // 更新关注方关注数
  .then(() => updateFansCount(info.follow));  // 更新被关注方粉丝数
}

/**
 * remark 备注修改
 */
function remark(info) {
  return db.Nexus.update({remark: info.remark}, {where: {fans: info.fans, follow: info.follow}});
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
  return db.Nexus.findOne({where: {fans: info.fans, follow: info.follow}})
  .then(one => {
    if (!one) {
      throw new Error('你未关注对方，请先关注');
    }
    return ;
  })
  // 先删除不在新分组列表中的记录
  .then(() => db.Relationship.destroy({where: {fans: info.fans, follow: info.follow, group: {$notIn: info.groups}}}))
  // 再补上新分组列表中新分到的记录
  .then(() => {
    if (!info.groups.length) {
      return db.Nexus.update({toGroup: false}, {where: {fans: info.fans, follow: info.follow}});
    }
    return Promise.map(info.groups, g => db.Relationship.findOrCreate({where: {fans: info.fans, follow: info.follow, group: g}}))
    .then(() => db.Nexus.update({toGroup: true}, {where: {fans: info.fans, follow: info.follow}}));
  })
  // 更新发起关注方各分组成员数
  .then(() => updateGroupsCount(info.fans));
}

/**
 * black 拉黑
 */
function black(info) {
  return db.Black.findOne({where: {fans: info.fans, follow: info.follow}})
  .then(one => {
    if (one) {
      throw new Error('你已拉黑对方');
    }
    // 拉黑前双方各自移除对方的关注、分组记录
    return db.Nexus.destroy({where: {fans: info.fans, follow: info.follow}})
    .then(() => db.Nexus.destroy({where: {fans: info.follow, follow: info.fans}}))
    .then(() => db.Relationship.destroy({where: {fans: info.fans, follow: info.follow}}))
    .then(() => db.Relationship.destroy({where: {fans: info.follow, follow: info.fans}}))
    .then(() => db.Black.create({fans: info.fans, follow: info.follow}));
  })
  // 更新拉黑方各数
  .then(() => updateGroupsCount(info.fans))
  .then(() => updateFollowCount(info.fans))
  .then(() => updateFansCount(info.fans))
  // 更新被拉黑方各数
  .then(() => updateGroupsCount(info.follow))
  .then(() => updateFollowCount(info.follow))
  .then(() => updateFansCount(info.follow));
}

/**
 * unblack 解除黑名单
 */
function unblack(info) {
  // 删除拉黑记录
  return db.Black.destroy({where: {fans: info.fans, follow: info.follow}})
  // 更新解除拉黑方各分组成员数
  .then(count => {
    if (!count) {
      throw new Error('你未拉黑对方');
    }
    return updateGroupsCount(info.fans);
  });
}

/**
 * remove 移除粉丝
 */
function remove(info) {
  return db.Nexus.destroy({where: {fans: info.fans, follow: info.follow}})
  .then(count => {
    if (!count) {
      throw new Error('该用户未关注你，无需移除');
    }
    return ;
  })
  .then(() => db.Relationship.destroy({where: {fans: info.fans, follow: info.follow}}))
  .then(() => updateGroupsCount(info.fans)) // 更新被移除fans各组成员数
  .then(() => updateFollowCount(info.fans)) // 更新被移除fans全部关注数
  .then(() => updateFansCount(info.follow));  // 更新移除方粉丝数
}

/**
 * outgroup 移出分组
 */
function outgroup(info) {
  return db.Relationship.destroy({where: {fans: info.fans, follow: info.follow, group: info.gid}})
  .then(() => updateGroupsCount(info.fans));  // 更新未分组成员数
}

/**
 * modifyWeiboCount 更新微博数
 */
function modifyWeiboCount(param) {
  return db.User.findOne({
    where: {id: param.uid}
    // transaction: param.t || {}
  })
  .then(function (ret) {
    if (param.action === 'add') {
      return ret.updateAttributes({
        weiboCount: ret.weiboCount + 1,
        weiboUpdate: param.time
      });
    }
    else if (param.action === 'del') {
      return ret.updateAttributes({
        weiboCount: ret.weiboCount - 1,
        weiboUpdate: param.time
      });
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
    else {
      return ret[0];
    }
  });
}

/**
 * modifyGroup 更新分组信息
 * @param {Number} creator
 * @param {Number} gid
 * @param {Object} group
 */
function modifyGroup(group, creator, gid) {
  return db.Group.findOne({
    where: {
      name: group.name,
      creator: creator
    }
  })
  .then(function (ret) {
    if (ret && gid != ret.dataValues.id) {
      throw new Error('分组名已被使用');
    }
    // 更新分组列表里该分组信息
    return db.Group.findOne({
      where: {
        id: gid,
        creator: creator
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
      id: gid
    }
  })
  .then(function (ret) {
    if (!ret) {
      throw new Error('此分组不存在');
    }
    // 关注列表里删除分组，若导致用户未分组，更新关系表的toGroup属性
    return db.Relationship.findAll({
      where: {
        fans: creator,
        group: gid
      }
    })
    .then(records => Promise.map(records, record => {
      return db.Relationship.count({where: {fans: creator, follow: record.dataValues.follow}})
      .then(c => {
        if (c == 1) {
          return db.Nexus.update({toGroup: false}, {where: {fans: creator, follow: record.dataValues.follow}});
        }
        else {
          return record;
        }
      })
    }))
    .then(() => db.Relationship.destroy({where: {fans: creator, group: gid}}));
  });
}

/**
 * getInfo 获取个人信息
 */
function getInfo(id) {
  return db.User.findOne({where: {id: id}})
  .then(ret => {
    if (!ret) {
      throw new Error('未找到该用户');
    }
    else {
      return ret.dataValues;
    }
  });
}

/**
 * getInfoByName 通过用户名获取个人信息
 */
function getInfoByName(name) {
  return db.User.findOne({where: {name: name}})
  .then(ret => {
    if (!ret) {
      throw new Error('未找到该用户');
    }
    else {
      return ret.dataValues;
    }
  });
}

/**
 * getInfoByAcc 通过用户名或备注获取信息（数组）
 */
function getInfoByAcc(acc, me, range) {
  switch (range) {
    case 'fans':
      return getFans(me, 'time').then(fans => Promise.each(fans, (f, index) => {
        if (f.name != acc && f.remark != acc) {
          fans.splice(index, 1);
        }
        return fans;
      }));
    case 'follow':
      return getFollow(me, 'time').then(follow => Promise.each(follow, (f, index) => {
        if (f.name != acc && f.remark != acc) {
          follow.splice(index, 1);
        }
        return follow;
      }));
    default :
      return db.Nexus.findAll({where: {fans: me, remark: acc}, order: 'id DESC'})
      .then(fos => {
        if (fos.length) {
          return Promise.map(fos , f => {f = f.dataValues.follow})
          .then(fos => Promise.map(fos, f => {
            return db.User.findOne({where: {id: f}})
            .then(ret => {f = ret.dataValues});
            })
          );
        }
        return [];
      })
      .then(fos => db.User.findOne({where: {name: acc}})
        .then(ret => {
          if (ret) {
            fos.push(ret.dataValues);
          }
          fos = _.uniq(fos);
          return fos;
        })
      );
  }
}

/**
 * getRemark 获取备注名、分组数组
 */
function getRemark(fans, follow) {
  let result = {remark: '', groups: []};
  return db.Nexus.findOne({where: {fans: fans, follow: follow}, raw: true})
  .then(one => {
    if (one) {
      result.remark = one.remark;
      if (one.toGroup) {
        return db.Relationship.findAll({where: {fans: fans, follow: follow}, raw: true})
        .then(records => Promise.map(records, record => {
          return db.Group.findOne({where: {id: record.group}})
          .then(r => result.groups.push(r));
        }))
        .then(() => result);
      }
      else {
        return result;
      }
    }
    else {
      return result;
    }
  });
}

/**
 * getFollow 获取关注列表
 */
function getFollow(id, sort, me) {
  return db.Nexus.findAll({where: {fans: id}, order: 'id DESC'})
  .then(ret => Promise.map(ret, r => {
    r = r.dataValues.follow;
    return r;
  })) // 拿到所有被关注者id数组
  .then(ret => Promise.map(ret, r => {
    return getInfo(r).then(re => {
      r = re;
      return r;
    })
    .then(r => getRemark(me, r.id))
    .then(rem => {
      r.remark = rem.remark;
      r.groups = rem.groups;
      return r;
    })
    .then(r => getEachOther(me, r.id))
    .then(sta => {
      r.status = sta.status;
      return r;
    });
  })) // 将用户信息、备注、分组丰富进数组
  .then(follow => {
    switch (sort) {
      case 'fans':
        follow = _.sortBy(follow, ['fansCount']);
        follow = _.reverse(follow);
        return follow;
      case 'each':
        let each = [];
        return Promise.each(follow, f => {
          return db.Nexus.findOne({where: {fans: f.id, follow: id}})
          .then(one => {
            if (one) {
              each.push(f);
            }
            return f;
          });
        })
        .then(() => each);
      case 'name':
        follow = _.sortBy(follow, ['name']);
        return follow;
      case 'update':
        follow = _.sortBy(follow, ['weiboUpdate']);
        follow = _.reverse(follow);
        return follow;
      default:
        return follow;
    }
  });
}

/**
 * getFans 获取粉丝列表
 */
function getFans(id, sort, me) {
  return db.Nexus.findAll({where: {follow: id}, order: 'id DESC'})
  .then(ret => Promise.map(ret, r => {
    r = r.dataValues.fans;
    return r;
  })) // 拿到所有粉丝id数组
  .then(ret => Promise.map(ret, r => {
    return getInfo(r).then(re => {
      r = re;
      return r;
    })
    .then(r => getEachOther(me, r.id))
    .then(sta => {
      r.status = sta.status;
      r.groups = sta.groups;
      return r;
    });
  })) // 将用户信息丰富进数组
  .then(fans => {
    switch (sort) {
      case 'fans': 
        fans = _.sortBy(fans, ['fansCount']);
        fans = _.reverse(fans);
        return fans;
      case 'each':
        let each = [];
        return Promise.each(fans, f => {
          return db.Nexus.findOne({where: {fans: id, follow: f.id}})
          .then(one => {
            if (one) {
              each.push(f);
            }
            return f;
          });
        })
        .then(() => each);
      case 'not':
        let not = [];
        return Promise.each(fans, f => {
          return db.Nexus.findOne({where: {fans: id, follow: f}})
          .then(one => {
            if (!one) {
              not.push(f);
            }
            return f;
          });
        })
        .then(() => not);
      default:
        return fans;
    }
  });
}

/**
 * getGroups 获取分组列表
 */
function getGroups(where) {
  return db.Group.findAll({where: where, raw: true});
}

/**
 * getGroupDetail 获取分组详情
 */
function getGroupDetail(id, gid) {
  return db.Group.findOne({where: {id: gid}})
  .then(ret => {
    if (!ret) {
      throw new Error('该分组不存在');
    }
    if (ret.dataValues.creator !== id && !ret.dataValues.public) {
      throw new Error('您无权查看该分组');
    }
    return ret.dataValues;
  });
}

/**
 * getGroupMember 获取分组成员
 */
function getGroupMember(params, me) {
  // 查看自己的未分组成员
  if (params.id == 0 && !params.public) {
    return db.Nexus.findAll({where: {fans: me, toGroup: false}, raw: true})
    .then(ret => Promise.map(ret, r => {
      return getEachOther(me, r.follow)
      .then(info => {
        r = {id: r.follow, status: info.status, groups: []};
        return r;
      });
    }));
  }

  return db.Group.findOne({where: params, raw: true})
  .then(one => {
    if (!one) {
      throw new Error('查看分组失败（不存在或无权限）');
    }
    else {
      return db.Relationship.findAll({where: {group: params.id}, order: 'id DESC'})
      .then(ret => Promise.map(ret, r => {
        r = r.dataValues.follow;
        return r;
      })) // 获取全部成员id数组
      .then(ret => Promise.map(ret, r => {
        return getEachOther(me, r).then(info => {
          r = {id: r, status: info.status,  groups: info.groups};
          return r;
        });
      }));
    }
  });
}

/**
 * getCommonFollow 获取共同关注
 */
function getCommonFollow(id, uid) {
  let common = [];
  return db.Nexus.findAll({where: {fans: id}, raw: true})
  // 拿到本人所有关注记录数组
  .then(ret => {
    if (!ret) {
      return common;
    }
    return Promise.map(ret, r => db.Nexus.findOne({where: {fans: uid, follow: r.follow}, raw: true})
      .then(one => {
        if (one) {
          common.push(one.follow);
        }
        return r;
      })
    );
  })
  .then(() => common);
}

/**
 * getCommonFans 获取共同粉丝
 */
function getCommonFans(id, uid) {
  let common = [];
  // 先获取全部“我的粉丝”
  return db.Nexus.findAll({where: {follow: id}, raw: true})
  // 再筛选共同粉丝
  .then(ret => {
    if (!ret) {
      return common;
    }
    return Promise.each(ret, r => db.Nexus.findOne({where: {fans: r.fans, follow: uid}, raw: true})
      .then(one => {
        if (one) {
          common.push(one.fans);
        }
        return r;
      }));
  })
  .then(() => common);
}

/**
 * getBlack 获取黑名单
 */
function getBlack(id) {
  return db.Black.findAll({where: {fans: id}, raw: true, order: 'id DESC'});
}

/**
 * getEachOther 获取a对b的互粉关系
 */
function getEachOther(a, b) {
  return db.Black.findOne({where: {fans: a, follow: b}})
  .then(ret => {
    if (ret) {
      return {status: 0, groups: []}; // '已拉黑'
    }
    else {
      return db.Nexus.findOne({where: {fans: a, follow: b}})
      .then(one => {
        if (!one) {
          return {status: 1, groups: []}; // '+关注'
        }
        else {
          // 拿到所有分组记录数组
          return db.Relationship.findAll({where: {fans: a, follow: b}, raw: true})
          // 将数组细化为分组信息
          .then(r => Promise.map(r, ri => {
            return db.Group.findOne({where: {id: ri.group}})
            .then(ginfo => {
              ri = ginfo.dataValues;
              return ri;
            });
          })) // 获取所有分组id数组
          .then(groups => {
            // if (!groups.length) {
            //   return {staus: 1, groups: [0]};  // '已关注'，未分组
            // }
            return db.Nexus.findOne({where: {fans: b, follow: a}})
            .then(one => {
              if (!one) {
                return {status: 2, groups: groups};  // '已关注'，groups可能为空数组（未分组）
              }
              else {
                return {status: 3, groups: groups};  // '互相关注'
              }
            });
          });
        }
      });
    }
  });
}

/**
 * updateGroupsCount 更新某人所有分组成员数
 */
function updateGroupsCount(id) {
  return db.Group.findAll({where: {creator: id}, raw: true})
  .then(gids => Promise.each(gids, gid => {
    return db.Relationship.count({where: {group: gid.id}})
    .then(c => db.Group.update({count: c}, {where: {id: gid.id}}));
  }))
  // 更新未分组成员数
  .then(() => db.Nexus.count({where: {fans: id, toGroup: false}}))
  .then(c => db.User.update({notCount: c}, {where: {id: id}}))
  // 更新黑名单成员数
  .then(() => db.Black.count({where: {fans: id}}))
  .then(c => db.User.update({blackCount: c}, {where: {id: id}}));
}

/**
 * updateFollowCount 更新某人全部关注数
 */
function updateFollowCount(id) {
  return db.Nexus.count({where: {fans: id}})
  .then(c => db.User.update({followCount: c}, {where: {id: id}}));
}

/**
 * updateFansCount 更新某人粉丝数
 */
function updateFansCount(id) {
  return db.Nexus.count({where: {follow: id}})
  .then(c => db.User.update({fansCount: c}, {where: {id: id}}));
}
