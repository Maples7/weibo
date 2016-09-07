const _ = require('lodash');
const Promise = require('bluebird');

const userService = require('./user');
const db = require('../models');
const cache = require('../lib/cache');
const cacheKey = require('../lib/cache/cacheKey');

const _getWeiboBaseInfo = Symbol('getWeiboBaseInfo');
const _updateFavorCount = Symbol('updateFavorCount');
const _getCommentDetail = Symbol('getCommentDetail');

module.exports = new class {
    /**
     * 获取微博的详细信息
     */
    getWeiboDetail(wbId, options = {}) {
        return cache.wrapAsync(cacheKey.weiboDetail(wbId), () => db.models.Weibo.findById(wbId, {raw: true}))
            .tap(wbObj => {
                if (options.needUserDetail) {
                    return userService.getInfoByName(wbObj.author)
                        .then(userInfo => wbObj.author = userInfo);
                }
            }).tap(wbObj => {
                if (wbObj) {
                    if (wbObj.originalId && options.needOriginalWeiboDetail) {
                        return this[_getWeiboBaseInfo](wbObj.originalId).then(wbBaseInfo => {
                            wbObj.originalWeibo = wbBaseInfo;
                            delete wbObj.originalId;
                        });
                    }
                }
            });
    }

    /**
     * 获取微博最基本的信息，包括 id, content, author
     */
    [_getWeiboBaseInfo](wbId) {
        return db.models.Weibo.findById(wbId, {raw: true}).then(wbDetail => ({
            id: wbDetail.id,
            author: wbDetail.author,
            content: wbDetail.content
        }));
    }

    /**
     * 发表或转发微博
     */
    addWeibo(wbInfo, options = {commentSync, t}) {
        let keyValues = {
            content: wbInfo.content,
            author: wbInfo.author,
            forwardId: wbInfo.forwardId || null,
            originalId: wbInfo.originalId || null,
            from: wbInfo.from,
            creatTime: Date.now()
        };
        return db.transaction(t => {
            return db.models.Weibo.create(keyValues, {
                raw: true,
                type: db.QueryTypes.RAW,
                transaction: options.t || t
            }).tap(() => {
                return userService.modifyWeiboCount({
                    id: wbInfo.authorId,
                    action: 'add',
                    t: options.t || t
                });
            }).tap(() => {
                if (options.commentSync && keyValues.forwardId) {
                    return this.addComment({
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
        return db.transaction(t => {
            return db.models.Weibo.update({ deleteTime: Date.now() }, {
                where: {
                    id: wbId,
                    author: user,
                    deleteTime: 0
                },
                fields: ['deleteTime'],
                raw: true
            }).tap(() => {
                return userService.modifyWeiboCount({
                    name: user,
                    action: 'del',
                    transaction: t
                });
            }).spread(affectedCount => 
                affectedCount ? 
                    '删除成功' : 
                    Promise.reject(new Error('删除失败'))
            );
        });
    }

    /**
     * 添加评论
     */
    addComment(cmInfo, options = {forwardSync, t}) {
        let keyValues = {
            weiboId: cmInfo.weiboId,
            content: cmInfo.content,
            author: cmInfo.author,
            replyId: cmInfo.replyId || null,
            createTime: Date.now()
        };

        return db.transaction(t => {
            return db.models.Comment.create(keyValues, {
                raw: true,
                type: db.QueryTypes.RAW,
                transaction: options.t || t
            }).tap(() => {
                let forwardContent = '';
                if (options.forwardSync) {
                    if (keyValues.replyId) {
                        this[_getCommentDetail](keyValues.replyId).then(cmDetail => {
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
            }).tap(() => {
                // TODO: 评论数 + 1
            }).return('操作成功');
        });
    }

    /**
     * 获取单条评论详情
     */
    [_getCommentDetail](cmId) {
        return db.models.Comment.findById(cmId, {raw: true});
    }

    /**
     * 获取评论列表
     */
    getCommentList(wbId, options) {
        let finalAns = {};

        return db.models.Comment.findAll({
            where: {
                weiboId: wbId,
                deleteTime: 0
            },
            attributes: ['id'],
            order: [['createTime', 'DESC']],
            raw: true
        }).map(cmObj => this[_getCommentDetail](cmObj.id)).then(cmList => {
            if (options.offset === 0) {
                let totalFavorCount = _.sumBy(cmList, o => o.favorCount);
                let totalCommentCount = cmList.length;
                let criticalValue = totalFavorCount / totalCommentCount;
                finalAns.hotComments = 
                    cmList
                        .filter(o => o.favorCount > criticalValue)
                        .slice(options.hotOffset, options.hotOffset + options.limit);
            }
            finalAns.ordinaryComments =
                cmList.slice(options.offset, options.offset + options.limit);
            
            return finalAns;
        });     
    }

    /**
     * 给微博/评论点赞
     */
    addFavor(table, id, user) {
        return db.transaction(t =>
            db.models.Favor.findOrCreate({
                raw: true,
                where: {
                    itemId: id, 
                    userName: user,
                    itemType: table
                },
                defaults: { createTime: Date.now() },
                transaction: t
            }).spread((instance, created) => {
                if (created) {
                    return this[_updateFavorCount](table, id, '+ 1', {t})
                        .then(result =>
                            result.affectedRows ? 
                                '点赞成功' : 
                                Promise.reject(new Error('点赞失败')) 
                        )
                } else {
                    return Promise.reject(new Error('已经赞过'));
                }
            })
        );
    }

    /**
     * 给微博/评论消赞
     */
    deleteFavor(table, id, user) {
        return db.transaction(t =>
            db.models.Favor.destroy({
                where: {
                    itemId: id, 
                    userName: user,
                    itemType: table
                },
                transaction: t
            }).then(deletedRows => {
                if (deletedRows) {
                    return this[_updateFavorCount](table, id, '- 1', {t})
                        .then(result =>
                            result.affectedRows ? 
                                '消赞成功' : 
                                Promise.reject(new Error('消赞失败'))
                        )
                } else {
                    return Promise.reject(new Error('尚未点赞'));
                }
            })
        );
    }

    /**
     * 更新微博/评论点赞数
     */
    [_updateFavorCount](table, id, operation, options) {
        table = table + 's';
        let sqlStr = '' +
            'UPDATE ' + table + ' ' +
            'SET favorCount = favorCount ' + operation + ' ' +
            'WHERE id = ? ';
        return db.query(sqlStr, {
            replacements: [id],
            type: db.QueryTypes.RAW,
            raw: true,
            transaction: options.t
        }).get(0);
    }
}();
 