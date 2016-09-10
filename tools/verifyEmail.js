/**
 * Created by Maples7 on 2016/8/6.
 */
const regexp = require('../enums/regexp');

module.exports = function validateEmail(email) {
    return regexp.email.test(email);
};
