const TIME = require('../enums/time');

module.exports = {
    weiboDetail(wbId) {
        return {
            key: ['weibos', 'detail'],
            field: [wbId],
            expire: TIME.HOUR
        }
    },
    weiboBaseInfo(wbId) {
        return {
            key: ['weibos', 'baseInfo'],
            field: [wbId],
            expire: TIME.YEAR
        }
    },
    commentDetail(cmId) {
        return {
            keys: ['comments', 'detail'],
            field: [cmId],
            expire: TIME.MONTH
        }
    },
    commentList(wbId) {
        return {
            keys: ['weibos', 'commentList'],
            field: [wbId],
            expire: TIME.HOUR
        }
    }
}
