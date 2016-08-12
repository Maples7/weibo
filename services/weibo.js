const _ = require('lodash');
const Promise = require('bluebird');

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
    addWeibo(wbInfo, options = {commentSync = false, t = undefined}) {
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
                transaction: options.t || t
            }).tap(() => {
                // TODO: 更新用户微博数统计
            }).tap(() => {
                if (options.commentSync) {
                    this.addComment({
                        weiboId: keyValues.forwardId,
                        content: keyValues.content,
                        author: keyValues.author,
                        from: keyValues.from
                    }, {t: t});
                }
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
    addComment(cmInfo, options = {forwardSync = false, t = undefined}) {
        let keyValues = {
            weiboId: cmInfo.weiboId,
            content: cmInfo.content,
            author: cmInfo.author,
            replyId: cmInfo.replyId || null,
            createTime: Date.now()
        };

        return db.sequelize.transaction(t => {
            let forwardContent = '';
            return db.Comment.create(keyValues, {
                raw: true,
                type: db.sequelize.QueryTypes.RAW,
                transaction: options.t || t
            }).tap(() => {
                if (options.forwardSync) {
                    if (keyValues.replyId) {
                        this.getCommentDetail(keyValues.replyId).then(cmDetail => {
                            forwardContent += '回复@' + cmDetail.author + ':'
                                + keyValues.content + '//@' + cmDetail.author + ':'
                                + cmDetail.content;
                        });
                    } else {
                        forwardContent += keyValues.content;
                    }
                    this.getWeiboDetail(keyValues.weiboId).then(wbDetail => {
                        if (wbDetail.content) {
                            forwardContent += '//@' + wbDetail.author + ':' + wbDetail.content
                        }
                        this.addWeibo({
                            content: forwardContent,
                            author: keyValues.author,
                            forwardId: keyValues.weiboId,
                            originalId: wbDetail.originalId,
                            from: cmInfo.from
                        }, {t: t});
                    });
                }
            }).return('操作成功');
        });
    }

    /**
     * 获取单条评论详情
     */
    static getCommentDetail(cmId) {
        return db.Comment.findById(cmId);
    }

    /**
     * 获取评论列表
     */
    getCommentList(wbId, options) {
        let finalAns = {};

        return db.Comment.findAll({
            where: {
                weiboId: wbId,
                deleteTime: 0
            },
            attributes: ['id'],
            order: [['createTime', 'DESC']]
        }).get('id').map(this.getCommentDetail).then(cmList => {
            if (options.offset === 0) {
                let totalFavorCount = _.sumBy(cmList, o => o.favorCount);
                let totalCommentCount = cmList.length;
                let criticalValue = totalFavorCount / totalCommentCount;
                finalAns.hotComments = 
                    cmList.filter(o => o.favorCount > criticalValue).slice(0, options.limit);
                finalAns.ordinaryComments = 
                    cmList.filter(o => o.favorCount <= criticalValue)
                        .slice(0, options.limit - finalAns.hotComments.length);
            } else {
                finalAns.ordinaryComments =
                    cmList.slice(options.offset, options.offset + options.limit);
            }
            return finalAns;
        });     
    }

    /**
     * 给微博/评论点赞
     */
    addFavor(table, id, user) {
        return db.sequelize.transaction(t =>
            db[table + 'Favor'].upsert({
                [table.toLowerCase() + 'Id']: id, 
                userName: user
            }, { transaction: t }).then(created => {
                if (created) {
                    return this.updateFavorCount(table, id, '+ 1', {t: t})
                        .then(result =>
                            result.affectedRows ? '点赞成功' : Promise.reject('点赞失败') 
                        )
                } else {
                    return Promise.reject('已经赞过');
                }
            })
        );
    }

    /**
     * 给微博/评论消赞
     */
    deleteFavor(table, id, user) {
        return db.sequelize.transaction(t =>
            db[table + 'Favor'].destroy({
                where: {
                    [table.toLowerCase() + 'Id']: id, 
                    userName: user
                },
                transaction: t
            }).then(deletedRows => {
                if (deletedRows) {
                    return this.updateFavorCount(table, id, '- 1', {t: t})
                        .then(result =>
                            result.affectedRows ? '消赞成功' : Promise.reject('消赞失败')
                        )
                } else {
                    return Promise.reject('尚未点赞');
                }
            })
        );
    }

    /**
     * 更新微博/评论点赞数
     */
    static updateFavorCount(table, id, operation, options) {
        table = table.toLowerCase() + 's';
        let sqlStr = '' +
            'UPDATE ' + table + ' ' +
            'SET favorCount = favorCount ' + operation + ' ' +
            'WHERE id = ? ';
        return db.sequelize.query(sqlStr, {
            replacements: [id],
            type: db.sequelize.QueryTypes.RAW,
            raw: true,
            transaction: options.t
        }).get(0);
    }
}();
 