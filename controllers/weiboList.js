const _ = require('lodash');

const weibo = require('../services/weibo');
const status = require('../enums/resStatus');

/**
 * @apiIgnore
 * @api {get} /weibos 获取微博列表
 * @apiName getWeiboList
 * @apiGroup Weibo
 * @apiPermission anyone|LoginUser
 * @apiVersion 0.0.1
 * 
 * @apiDescription 已登录时查询Group组有权限查看的微博，未登录时查询全站最新公开微博
 * 
 * @apiParam {String{1..50}}    [group]   - 某个分组（如：英语）成员的微博列表，默认查询全部
 * @apiParam {Number}           [limit=20]   
 * @apiParam {Number}           [offset=0]
 *   
 * @apiUse GetWeiboListSuccess
 */
exports.getWeiboList = (req, res, next) => {
    let options = {
        group: req.query.group,
        limit: req.query.limit || 20,
        offset: req.query.offset || 0,
        user: req.session.user
    };

    return weibo.getWeiboList(options)
        .then(data => res.api(data)).catch(err => res.api_error(err.message));
}
