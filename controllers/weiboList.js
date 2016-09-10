const _ = require('lodash');

const weibo = require('../services/weibo');
const status = require('../enums/resStatus');

/**
 * @api {get} /weibos 获取微博列表
 * @apiName getWeiboList
 * @apiGroup Weibo
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiParam {String{1..50}}    [group]   - 某个分组（如：英语）成员的微博列表，默认查询全部
 * @apiParam {Number}           [limit=20]   
 * @apiParam {Number}           [offset=0]
 * 
 *   
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
