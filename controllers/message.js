const message = require('../services/message');

/**
 * @apiIgnore
 * @api {get} /messages/unhint 获取所有未提醒的消息
 * @apiName getAllUnhintMessages
 * @apiGroup Message
 * @apiPermission LoginUser
 * @apiVersion 0.0.1
 * 
 * @apiUse getAllUnhintMessagesSuccess
 */
exports.getAllUnhintMessages = (req, res, next) => {
    let uid = req.session.user.id;

    return message.getAllUnhintMessages(uid)
        .then(data => res.api(data)).catch(err => res.api_error(err.message));
}