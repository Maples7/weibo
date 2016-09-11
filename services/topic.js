const _ = require('lodash');

const db = require('../models');
const cache = require('../lib/cache');
const cacheKey = require('../lib/cache/cacheKey');

const _getTopicDetail = Symbol(getTopicDetail);

module.exports = new class {
    /**
     * 将wbId添加进某话题，尚不存在的话题会被自动创建
     */
    addWeibo2Topic(wbId, topicName, options = {}) {
        return db.models.Topic.findOrCreate({
            where: { name: topicName },
            defaults: { name: topicName },
            transaction: options.t,
            raw: true
        }).then(topicDetail => {
            let wbIds = (new Set(JSON.parse(topicDetail.weiboIds))).add(wbId); 
            return db.models.Topic.update({
                weiboIds: [...wbIds]
            }, {
                where: { id: topicDetail.id },
                fields: ['weiboIds'],
                transaction: options.t
            }).tap(() => cache.del(cacheKey.topicWbIds(topicDetail.name)));
        });
    }

    /**
     * 获取话题详情
     */
    [_getTopicDetail](tpId){
        return cache.hget(cacheKey.topicDetail(tpId), () => db.models.Topic.findById(tpId, {raw: true})
            .then(tpDetail => {
                delete tpDetail.weiboIds;
                return tpDetail;
            }));
    }

    /**
     * 获取热门话题列表
     */
    getHotTopics(limit) {
        return cache.smember(cacheKey.hotTopics(limit), () => db.models.Topic.findAll({
            attributes: ['id'],
            order: [['readCount', 'DESC'], ['creatTime', 'DESC']],
            limit: limit,
            raw: true
        }).map(o => o.id)).map(tpId => this[_getTopicDetail](tpId));
    }

    /**
     * 获取某一个话题下的微博列表
     */
    getTopicWeibos(topicName, options) {
        return cache.smember(cacheKey.topicWbIds(topicName), () => db.models.Topic.findAll({
            attributes: ['weiboIds'],
            where: { name: topicName },
            raw: true
        }).get(0).then(tpObj => JSON.parse(tpObj.weiboIds)));
    }
}();
