/**
 * Created by Ming Tae on 2016/8/11
 */
var crypto = require('crypto');

exports.encodePassword = encodePassword;

function encodePassword(myPassword) {
  let md5 = crypto.createHash('md5');
  let password = md5.update(myPassword).digest('hex');
  return password;
}