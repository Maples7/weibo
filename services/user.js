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

  return db.User.findOne(where)
  .then(function (ret) {
    return ret;
  })
  .catch(function (err) {
    return err;
  });
}

/**
 * register 注册
 * @param userObj
 */
function register(userObj) {
  let password = encode(userObj);
  let defaults = {password: password};
  
  db.find();
}