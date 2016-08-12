/**
 * Created by Ming Tae on 2016/8/11
 */
var bcrypt = require('bcrypt');

exports.encodePassword = encodePassword;

function encodePassword(myPassword) {
  const saltRounds = 10;

  bcrypt.hash(myPassword, saltRounds, function(err, hash) {
    if (err) {
      throw err;
    }
    else {
      return hash;
    } 
  });
}