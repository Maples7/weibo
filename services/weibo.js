const _ = require('lodash');
const Promise = require('bluebird');

const userService = require('./user');
const db = require('../models');
const cache = require('../lib/cache');
const cacheKey = require('../lib/cache/cacheKey');
const parseContent = require('../tools/parseContent');

const _getWeiboBaseInfo = Symbol('getWeiboBaseInfo');
const _updateCount = Symbol('updateCount');
const _getCommentDetail = Symbol('getCommentDetail');

module.exports = new class {
    /**
     * 获取微博的详细信息
     */
    getWeiboDetail(wbId, options = {}) {
        return cache.hget(cacheKey.weiboDetail(wbId), () => db.models.Weibo.findById(wbId, {raw: true}))
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
                        });
                    }
                }
            });
    }

    /**
     * 获取微博最基本的信息，包括 id, content, author
     */
    [_getWeiboBaseInfo](wbId) {
        return cache.hget(cacheKey.weiboBaseInfo(wbId), () => db.models.Weibo.findOne({
            where: { id: wbId, deleteTime: 0 },
            raw: true,
        }).then(wbDetail => 
            wbDetail ? ({
                id: wbDetail.id,
                author: wbDetail.author,
                content: wbDetail.content
            }) : '原微博已删除'
        ));
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
            createTime: Date.now()
        };

        if (wbInfo.scope) {
            if (!_.isNaN(+wbInfo.scope) || wbInfo.scope.includes(',')) {
                keyValues.scope = JSON.stringify(_.words(wbInfo.scope).map(num => +num));
            } else {
                keyValues.scope = wbInfo.scope;
            }
        }

        return db.transaction(t => 
            db.models.Weibo.create(keyValues, {
                raw: true,
                type: db.QueryTypes.RAW,
                transaction: options.t || t
            }).tap(wbDetail =>
                userService.modifyWeiboCount({
                    name: wbDetail.author,
                    action: 'add',
                    t: options.t || t,
                    time: wbDetail.createTime
                })
            ).tap(wbDetail => {
                if (options.commentSync && wbDetail.forwardId) {
                    return this.addComment({
                        weiboId: wbDetail.forwardId,
                        content: wbDetail.content,
                        author: wbDetail.author,
                        from: wbDetail.from
                    }, {t: t});
                }
            }).tap(wbDetail => {
                if (wbDetail.forwardId) {
                    return this[_updateCount]('weibo', 'forwardCount', wbDetail.forwardId, '+ 1', {
                        t: options.t || t
                    }).then(result => 
                        result.affectedRows ? Promise.resolve() : Promise.reject() 
                    ).tap(() => cache.hdel(cacheKey.weiboDetail(wbDetail.forwardId)));
                } 
            }).tap(wbDetail =>  
                parseContent(wbDetail.id, wbDetail.content, { t: options.t || t}) 
            ).tap(wbDetail => 
                cache.hdel(cacheKey.selfWeiboList(wbDetail.author))
            ).return('操作成功')
        );
    }

    /**
     * 删除微博
     */
    deleteWeibo(wbId, user) {
        return db.transaction(t => 
            db.models.Weibo.update({ deleteTime: Date.now() }, {
                where: {
                    id: wbId,
                    author: user,
                    deleteTime: 0
                },
                fields: ['deleteTime'],
                raw: true
            }).tap(() => 
                db.models.Weibo.findOne({
                    attributes: ['createTime'],
                    where: {author: user, deleteTime: 0},
                    order: [['createTime', 'DESC']],
                    raw: true
                }).then(wbInfo => 
                    userService.modifyWeiboCount({
                        name: user,
                        action: 'del',
                        transaction: t,
                        time: wbInfo.createTime || 0
                    })
                )
            ).tap(() => 
                cache.hdel([
                    cacheKey.weiboDetail(wbId), 
                    cacheKey.weiboBaseInfo(wbId),
                    cacheKey.selfWeiboList(user)
                ])
            ).spread(affectedCount => 
                affectedCount ? 
                    '删除成功' : 
                    Promise.reject(new Error('删除失败'))
            )
        );
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

        return db.transaction(t => 
            db.models.Comment.create(keyValues, {
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
                    return this.getWeiboDetail(keyValues.weiboId).then(wbDetail => {
                        if (wbDetail.content) {
                            forwardContent += '//@' + wbDetail.author + ':' + wbDetail.content
                        }
                        return this.addWeibo({
                            content: forwardContent,
                            author: keyValues.author,
                            forwardId: keyValues.weiboId,
                            originalId: wbDetail.originalId,
                            from: cmInfo.from
                        }, {t: t});
                    });
                }
            }).tap(() => 
                this[_updateCount]('weibo', 'commentCount', keyValues.weiboId, '+ 1', {
                    t: options.t || t
                }).then(result => 
                    result.affectedRows ? Promise.resolve() : Promise.reject() 
                ).tap(() => cache.hdel(cacheKey.weiboDetail(keyValues.weiboId)))
            ).tap(() => cache.hdel(cacheKey.commentList(keyValues.weiboId))).return('操作成功')
        );
    }

    /**
     * 获取单条评论详情
     */
    [_getCommentDetail](cmId) {
        return cache.hget(cacheKey.commentDetail(cmId), () => db.models.Comment.findById(cmId, {raw: true}));
    }

    /**
     * 获取评论列表
     */
    getCommentList(wbId, options) {
        let finalAns = {};

        return cache.hget(cacheKey.commentList(wbId), () => db.models.Comment.findAll({
            where: {
                weiboId: wbId,
                deleteTime: 0
            },
            attributes: ['id'],
            order: [['createTime', 'DESC']],
            raw: true
        })).map(cmObj => this[_getCommentDetail](cmObj.id)).then(cmList => {
            if (options.offset === 0) {
                let totalFavorCount = _.sumBy(cmList, o => o.favorCount);
                let totalCommentCount = cmList.length;
                let criticalValue = totalFavorCount / totalCommentCount;
                finalAns.hotComments = 
                    cmList
                        .filter(o => o.favorCount > criticalValue)
                        .slice(options.hotOffset, options.hotOffset + options.limit);
            }
            finalAns.allComments =
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
            }).spread((instance, created) => 
                created ? this[_updateCount](table, 'favorCount', id, '+ 1', {t})
                            .then(result =>
                                result.affectedRows ? 
                                    '点赞成功' : 
                                    Promise.reject(new Error('点赞失败')) 
                            )
                        : Promise.reject(new Error('已经赞过'))
            )
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
            }).then(deletedRows => 
                deletedRows ? this[_updateCount](table, 'favorCount', id, '- 1', {t})
                                .then(result =>
                                    result.affectedRows ? 
                                        '消赞成功' : 
                                        Promise.reject(new Error('消赞失败'))
                                )
                            : Promise.reject(new Error('尚未点赞'))
            )
        );
    }

    /**
     * 更新计数
     */
    [_updateCount](table, field, id, operation, options) {
        let sqlStr = '' +
            'UPDATE ' + table + 's ' +
            'SET ' + field + ' = ' + field + ' ' + operation + ' ' +
            'WHERE id = ? ';
        return db.query(sqlStr, {
            replacements: [id],
            type: db.QueryTypes.RAW,
            raw: true,
            transaction: options.t  
        }).get(0).tap(result =>
            result ? cache.hdel(cacheKey[table + 'Detail'](id)) : undefined
        );
    }

    /**
     * 获取微博列表
     */
    getIndexWeiboList(options) {
        return db.models.Weibo.findAll({
            where: {deleteTime: 0},
            attributes: ['id', 'scope', 'author'],
            order: [['createTime', 'DESC']],
            raw: true
        }).then(wbObjs => 
            options.user ? 
                wbObjs.filter(wbObj => {
                    if (!wbObj.scope) {
                        return true;
                    } else {
                        let scope = JSON.parse(wbObj.scope);
                        if (_.isString(scope)) {
                            return userService.getGroupMembersByName(scope, wbObj.author)
                                .then(idSet => idSet.has(options.user.id));
                        } else if (_.isArray(scope)) {
                            return _.includes(scope, options.user.id);
                        } else {
                            return Project.reject(new TypeError('Scope of weibo:' + 
                                wbObj.id + ' got the wrong type'
                            ));
                        }
                    }
                })
                : wbObjs
        ).then(wbObjs => 
            _.map(_.slice(wbObjs, options.offset, options.offset + options.limit), 'id')
        ).map(wbId => this.getWeiboDetail(o.id, {
            needUserDetail: true,
            needOriginalWeiboDetail: true
        }));
    }

    /**
     * 获取自己发的微博列表
     */
    getSelfWeiboList(userName, options) {
        return cache.hget(cacheKey.selfWeiboList(userName, options), () => db.models.Weibo.findAll({
            where: {
                author: userName,
                deleteTime: 0 
            },
            attributes: ['id'],
            order: [['createTime', 'DESC']],
            limit: options.limit,
            offset: options.offset,
            raw: true
        }).then(wbObjs => _.map(wbObjs, 'id')))
        .map(wbId => this.getWeiboDetail(wbId, {
            needOriginalWeiboDetail: true
        }));
    }
}();
