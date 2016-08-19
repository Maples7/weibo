const _ = require('lodash');

const weibo = require('../services/weibo');
const status = require('../enums/resStatus');

/**
 * 获取微博列表 - GET
 * @param {Object}      req
 * @param {String}      [req.query.group]   - 某个分组（如：英语）成员的微博列表，默认查询全部
 * @param {Number}      [req.query.limit]   - 默认为20
 * @param {Number}      [req.query.offset]  - 默认为0
 * @param {Object}      res
 * @param {Function}    next
 */
exports.getWeiboList = (req, res, next) => {
    let options = {
        group: req.query.group,
        limit: req.query.limit,
        offset: req.query.offset
    };

    return weibo.getWeiboList(/* ......... */)
        .then(data => res.api(data)).catch(err => res.api_error(err.message));
}
