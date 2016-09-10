const _ = require('lodash');

const db = require('../models');

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
            });
        });
    }

    /**
     * 获取热门话题列表
     */

    /**
     * 更新热门话题，每十分钟自动更新一次
     */

    /**
     * 获取某一个话题下的微博列表
     */
}();
