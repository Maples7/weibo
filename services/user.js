/**
 * Created by Ming Tae on 2016/8/11
 */
const db = require('../models/user');
const encode = require('../tools/crypt').encodePassword;

exports.login = login;
exports.register = register;

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
      // throw (new Error('用户名已被注册'));
      // 这里改成 res.api(...resStatus) 那种
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
      // throw (new Error('邮箱已被注册'));
      // 这里改成 res.api(...resStatus) 那种
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
      fans: 0,
      follow: 0,
      weiboCount: 0,
      createTime: (new Date()).Format('yyyy-MM-dd hh:mm:ss') 
    });
  });
}