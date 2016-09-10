const topic = require('../services/topic');

/**
 * @api {get} /topics/hot 获取热门话题
 * @apiName GetHotTopics
 * @apiGroup Topic
 * @apiPermission anyone
 * @apiVersion 0.0.1
 *  
 * @apiParam {Number} [limit=10] 条数
 * 
 * @apiUse GetHotTopicsSuccess
 */
exports.getHotTopics = (req, res, next) => {
    let limit = req.query.limit || 10;

    return topic.getHotTopics(limit)
        .then(data => res.api(data))
        .catch(err => res.api_error(err.message));
};  

