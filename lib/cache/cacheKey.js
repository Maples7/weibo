const TIME = require('../enums/time');

module.exports = {
    weiboDetail(wbId) {
        return {
            key: ['weibos', 'detail'],
            field: [wbId],
            expire: TIME.HOUR
        };
    },
    weiboBaseInfo(wbId) {
        return {
            key: ['weibos', 'baseInfo'],
            field: [wbId],
            expire: TIME.YEAR
        };
    },
    commentDetail(cmId) {
        return {
            key: ['comments', 'detail'],
            field: [cmId],
            expire: TIME.MONTH
        };
    },
    commentList(wbId) {
        return {
            key: ['weibos', 'commentList'],
            field: [wbId],
            expire: TIME.HOUR
        };
    },
    hotTopics(limit) {
        return {
            key: ['topics', 'hot', limit],
            expire: TIME.MINUTE * 10
        };
    },
    topicDetail(tpId) {
        return {
            key: ['topics', tpId, 'detail'],
            field: [tpId],
            expire: TIME.DAY
        };
    },
    topicWbIds(tpName) {
        return {
            key: ['topics', tpName, 'wbIds'],
            expire: TIME.WEEK
        };
    }
};
