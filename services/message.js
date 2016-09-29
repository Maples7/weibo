const _ = require('lodash');
const Promise = require('bluebird');

const db = require('../models');
const msgTypes = require('../enums/msgTypes');
const userService = require('./user');
const weiboService = require('./weibo');

module.exports = new class {
    /**
     * 获取所有未提醒消息
     */
    getAllUnhintMessage(uid) {
        function getItemInfo(msg) {
            switch (msg.itemType) {
                case 'FORWARD_WEIBO':
                case 'COMMENT':
                case 'WEIBO_AT':
                case 'FAVOR_WEIBO':
                    return weiboService.getWeiboDetail(msg.itemId, {
                        needUserDetail: 1,
                        needOriginalWeiboDetail: 1
                    }).tap(weiboDetail => msg.itemInfo = weiboDetail);
                case 'FAVOR_COMMENT':
                case 'COMMENT_AT':
                    return weiboService.getCommentDetail(msg.itemId).tap(cmDetail =>
                        weibo.getWeiboDetail(cmDetail.weiboId).tap(wbDetail => {
                            cmDetail.weiboDetail = wbDetail;
                            msg.itemInfo = cmDetail;
                        })
                    )
            }
        }

        let where = {receiver: uid, markHint: 0};

        return db.models.Message.findAll({
            raw: true,
            where: where,
            order: [['createTime', 'DESC']],
        }).map(msg =>  
            Promise.all([
                userService.getInfo(sender).tap(userInfo => 
                    msg.senderInfo = userInfo
                ),
                getItemInfo(msg)
            ]).return(msg)
        ).then(msgs => _.groupBy(msgs, 'itemType'))
        .tap(() =>
            db.models.Message.Update({
                markHint: 1
            }, {
                where: where,
                fields: ['markHint']
            })
        );
    }
}();