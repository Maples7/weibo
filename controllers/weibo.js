const _ = require('lodash');

const weibo = require('../services/weibo');
const status = require('../enums/resStatus');

/**
 * 获取微博详情 - GET
 * @param {Object}      req
 * @param {Number}      [req.query.needUserDetail]          - 真值判断依据来表示是否需要
 * @param {Number}      [req.query.needOriginalWeiboDetail] - 真值判断依据来表示是否需要
 * @param {Object}      res
 * @param {Function}    next
 */
exports.getWeiboDetail = (req, res, next) => {
    let wbId = req.params.wbId;

    return weibo.getWeiboDetail(wbId, {
        needUserDetail: req.query.needUserDetail,
        needOriginalWeiboDetail: req.query.needOriginalWeiboDetail
    }).then(data => res.api(data)).catch(err => res.api_error(err));
};

/**
 * 发表/转发微博 - POST
 * @param {Object}      req
 * @param {String}      req.body.content        - 微博内容；如果是转发，则为转发部分的内容
 * @param {String}      req.body.from           - “来自于”，客户端信息
 * @param {Number}      [req.body.forwardWbId]  - 转发微博时，直接被转发微博的Id
 * @param {Number}      [req.body.originalWbId] - 转发链顶端的微博id
 * @param {Number}      [req.body.commentSync]  - 是否转发微博的同时评论，1是0否
 * @param {Object}      res
 * @param {Function}    next
 */
exports.addWeibo = (req, res, next) => {
    let wbInfo = {
        content: req.body.content,
        from: req.body.from
    }    

    if (_.values(wbInfo).filter(Boolean).length < Object.keys(wbInfo).length) {
        return res.api(...status.lackParams);
    }

    wbInfo.forwardId = req.body.forwardId;
    wbInfo.originalId = req.body.originalId;
    wbInfo.author = req.session.name;

    if (wbInfo.forwardId && !wbInfo.originalId || 
        !wbInfo.forwardId && wbInfo.originalId) {
            return res.api(...status.xorParams);
        }

    return weibo.addWeibo(wbInfo, {
        commentSync: req.body.commentSync
    }).then(data => res.api(data)).catch(err => res.api_error(err));
};

/**
 * 删除微博 - DELETE
 * @param {Object}      req
 * @param {Object}      res
 * @param {Function}    next
 */
exports.deleteWeibo = (req, res, next) => {
    let wbId = req.params.wbId;
    let user = req.session.name;

    return weibo.deleteWeibo(wbId, user)
        .then(data => res.api(data)).catch(err => res.api_error(err));
};

/**
 * 发表评论 - POST
 * @param {Object}      req
 * @param {Number}      req.body.weiboId        - 被评论的微博Id
 * @param {String}      req.body.content        - 评论内容
 * @param {String}      req.body.from           - “来自于”，客户端信息
 * @param {Number}      [req.body.replyId]      - 被回复评论的Id，不传值表明为简单评论
 * @param {Number}      [req.body.forwardSync]  - 是否同时“转发”，1是0否
 * @param {Object}      res
 * @param {Function}    next
 */
exports.addComment = (req, res, next) => {
    let cmInfo = {
        weiboId: req.body.weiboId,
        content: req.body.content,
        from: req.body.from 
    };

    if (_.values(cmInfo).filter(Boolean).length < Object.keys(cmInfo).length) {
        return res.api(...status.lackParams);
    }

    cmInfo.replyId = req.body.replyId;
    cmInfo.author = req.session.name;

    return weibo.addComment(cmInfo, {
       forwardSync: req.body.forwardSync
    }).then(data => res.api(data)).catch(err => res.api_error(err));
};
