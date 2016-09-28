const Promise = require('bluebird');

const db = require('../models');
const msgTypes = require('../enums/msgTypes');

module.exports = new class {
    /**
     * 获取某一类型的未提醒消息
     */
    getUnhintMessageByType(uid, type) {
        
    }

    /**
     * 获取所有未提醒消息
     */
    getAllUnhintMessage(uid) {
        let ret = {};

        return Promise.then(() => 
            msgTypes.forEach(type => ret[type] = getUnhintMessageByType(uid, type))
        ).return(ret);
    }
}();