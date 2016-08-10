const db = require('../models');

module.exports = new class {
    /**
     * 获取微博的详细信息
     */
    getWeiboDetail(wbId, options = {}) {
        return db.Weibo.findById(wbId)
            .tap(wbObj => {
                if (options.needUserDetail) {
                    // TODO: 调用获取用户详情接口获得用户详情
                }
            }).tap(wbObj => {
                if (wbObj.originalId && options.needOriginalWeiboDetail) {
                    this.getWeiboBaseInfo(wbObj.originalId).then(wbBaseInfo => {
                        wbObj.originalWeibo = wbBaseInfo;
                        delete wbObj.originalId;
                    });
                }
            });
    }

    /**
     * 获取微博最基本的信息，包括 id, content, author
     */
    static getWeiboBaseInfo(wbId) {
        return db.Weibo.findById(wbId).then(wbDetail => ({
            id: wbDetail.id,
            author: wbDetail.author,
            content: wbDetail.content
        }));
    }

    /**
     * 发表或转发微博
     */
    addWeibo(wbInfo) {
        let keyValues = {
            content: wbInfo.content,
            author: wbInfo.author,
            forwardId: wbInfo.forwardId || null,
            originalId: wbInfo.originalId || null,
            from: wbInfo.from,
            creatTime: Date.now()
        };
        return db.sequelize.transaction(t => {
            return db.Weibo.create(keyValues, {
                raw: true,
                type: db.sequelize.QueryTypes.RAW,
                transaction: t
            }).tap(() => {
                // TODO: 更新用户微博数统计
            }).return('操作成功');
        });
    }

    /**
     * 删除微博
     */
    deleteWeibo(wbId, user) {
        return db.sequelize.transaction(t => {
            return db.Weibo.update({ deleteTime: Date.now() }, {
                where: {
                    id: wbId,
                    author: user,
                    deleteTime: 0
                },
                fields: ['deleteTime'],
                raw: true
            }).tap(() => {
                // TODO: 更新用户微博数统计
            }).spread(affectedCount =>
                affectedCount ? '删除成功' : new Error('删除失败')
            );
        });
    }

    /**
     * 添加评论
     */
    addComment(cmInfo, forwardSync = false) {
        let keyValues = {
            weiboId: cmInfo.weiboId,
            content: cmInfo.content,
            author: cmInfo.author,
            replyId: cmInfo.replyId || null,
            createTime: Date.now()
        };

        return db.sequelize.transaction(t => {
            return db.Comment.create(keyValues, {
                raw: true,
                type: db.sequelize.QueryTypes.RAW,
                transaction: t
            }).tap(() => {
                if (forwardSync) {
                    if (keyValues.replyId) {

                    } else {
                        
                    }
                }
            })
        })
    }
}();
