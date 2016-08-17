const status = require('../enums/resStatus');

module.exports = {
    checkLogin(req, res, next) {
        if (req.session && req.session.user) {
            next();
        } else {
            return res.api(...status.userNotLogin);
        }
    }
}