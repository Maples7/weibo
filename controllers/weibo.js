const _ = require('lodash');

const weibo = require('../services/weibo');
const status = require('../enums/resStatus');

/**
 * @api {get} /weibos/:wbId 获取微博详情
 * @apiName GetWeiboDetail
 * @apiGroup Weibo
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * 
 * @apiParam {Number=0,1}  [needUserDetail]               是否需要微博作者详情
 * @apiParam {Number=0,1}  [needOriginalWeiboDetail]      是否需要原微博详情
 * 
 * @apiUse GetWeiboDetailSuccess
 */
exports.getWeiboDetail = (req, res, next) => {
    let wbId = req.params.wbId;

    return weibo.getWeiboDetail(wbId, {
        needUserDetail: +req.query.needUserDetail,
        needOriginalWeiboDetail: +req.query.needOriginalWeiboDetail
    }).then(data => res.api(data)).catch(err => res.api_error(err.message));
};

/**
 * @api {post} /weibos 发表/转发微博
 * @apiName PostWeibo
 * @apiGroup Weibo
 * @apiPermission LoginUser
 * @apiVersion 0.0.1
 * 
 * @apiParam {String{1..500}}  content         微博内容；如果是转发，则为转发部分的内容
 * @apiParam {String{1..50}}   from            “来自于”，客户端信息
 * @apiParam {Number}          [forwardWbId]   转发微博时，直接被转发微博的Id
 * @apiParam {Number}          [originalWbId]  转发链顶端的微博id
 * @apiParam {Number=0,1}      [commentSync]   是否转发微博的同时评论，1是0否
 * 
 * @apiUse OperationSuccess
 */
exports.addWeibo = (req, res, next) => {
    let wbInfo = {
        content: req.body.content,
        from: req.body.from
    }    

    if (_.values(wbInfo).filter(Boolean).length < Object.keys(wbInfo).length) {
        return res.api(...status.lackParams);
    }

    wbInfo.forwardId = +req.body.forwardWbId;
    wbInfo.originalId = +req.body.originalWbId;
    wbInfo.author = req.session.user.name;
    wbInfo.authorId = req.session.user.id;

    console.log(wbInfo);

    if (!wbInfo.forwardId !== !wbInfo.originalId) {     // XOR
        return res.api(...status.xorParams);
    }

    return weibo.addWeibo(wbInfo, {
        commentSync: +req.body.commentSync
    }).then(data => res.api(data)).catch(err => res.api_error(err.message));
};

/**
 * @api {delete} /weibos/:wbId 删除微博
 * @apiName DeleteWeibo
 * @apiGroup Weibo
 * @apiPermission LoginUser
 * @apiVersion 0.0.1
 * 
 * @apiUse OperationSuccess
 */
exports.deleteWeibo = (req, res, next) => {
    let wbId = req.params.wbId;
    let user = req.session.user.name;

    return weibo.deleteWeibo(wbId, user)
        .then(data => res.api(data)).catch(err => res.api_error(err.message));
};

/**
 * @api {post} /weibos/:wbId/comments 发表评论
 * @apiName PostComment
 * @apiGroup Weibo
 * @apiPermission LoginUser
 * @apiVersion 0.0.1
 * 
 * @apiParam {String{1..500}}   content        评论内容
 * @apiParam {String{1..50}}    from           “来自于”，客户端信息
 * @apiParam {Number}           [replyId]      被回复评论的Id，不传值表明为简单评论
 * @apiParam {Number=0,1}       [forwardSync]  是否同时“转发”
 * 
 * @apiUse OperationSuccess
 */
exports.addComment = (req, res, next) => {
    let cmInfo = {
        weiboId: req.params.wbId,
        content: req.body.content,
        from: req.body.from 
    };

    if (_.values(cmInfo).filter(Boolean).length < Object.keys(cmInfo).length) {
        return res.api(...status.lackParams);
    }

    cmInfo.replyId = req.body.replyId;
    cmInfo.author = req.session.user.name;

    return weibo.addComment(cmInfo, {
       forwardSync: req.body.forwardSync
    }).then(data => res.api(data)).catch(err => res.api_error(err.message));
};

/**
 * @api {get} /weibos/:wbId/comments 获取某一微博的评论列表 
 * @apiName GetComments
 * @apiGroup Weibo
 * @apiPermission anyone
 * @apiVersion 0.0.1
 * @apiDescription 注意：只有当offset为0时才会获取热门评论
 * 
 * @apiParam {Number}      [limit=20]           对于所有评论的单次请求条数
 * @apiParam {Number}      [offset=0]           对于所有评论的偏移量
 * @apiParam {Number}      [hotLimit=5]         对于热门评论的单次请求条数
 * @apiParam {Number}      [hotOffset=0]        对于热门评论的偏移量
 * 
 * @apiUse GetCommentsSuccess
 */
exports.getCommentList = (req, res, next) => {
    let wbId = req.params.wbId;
    let options = {
        limit: req.query.limit || 20,
        offset: req.query.offset || 0,
        hotLimit: req.query.hotLimit || 5,
        hotOffset: req.query.hotOffset || 0
    };

    return weibo.getCommentList(wbId, options)
        .then(data => res.api(data)).catch(err => res.api_error(err.message));
};

/**
 * @api {post} /weibos/:wbId/favor 给微博点赞
 * @apiName PostWeiboFavor
 * @apiGroup Weibo
 * @apiPermission LoginUser
 * @apiVersion 0.0.1
 * 
 * @apiUse OperationSuccess
 */
exports.addWeiboFavor = (req, res, next) => {
    let wbId = req.params.wbId;
    let user = req.session.user.name;

    return weibo.addFavor('weibo', wbId, user)
        .then(data => res.api(data)).catch(err => res.api_error(err.message));
};

/**
 * @api {delete} /weibos/:wbId/favor 给微博消赞
 * @apiName DeleteWeiboFavor
 * @apiGroup Weibo
 * @apiPermission LoginUser
 * @apiVersion 0.0.1
 * 
 * @apiUse OperationSuccess
 */
exports.deleteWeiboFavor = (req, res, next) => {
    let wbId = req.params.wbId;
    let user = req.session.user.name;

    return weibo.deleteFavor('weibo', wbId, user)
        .then(data => res.api(data)).catch(err => res.api_error(err.message));
};

/**
 * @api {post} /comments/:cmId/favor 给某评论点赞
 * @apiName PostCommentFavor
 * @apiGroup Weibo
 * @apiPermission LoginUser
 * @apiVersion 0.0.1
 * 
 * @apiUse OperationSuccess
 */
exports.addCommentFavor = (req, res, next) => {
    let cmId = req.params.cmId;
    let user = req.session.user.name;

    return weibo.addFavor('comment', cmId, user)
        .then(data => res.api(data)).catch(err => res.api_error(err.message));
};

/**
 * @api {delete} /comments/:cmId/favor 给某评论消赞
 * @apiName DeleteCommentFavor
 * @apiGroup Weibo
 * @apiPermission LoginUser
 * @apiVersion 0.0.1
 * 
 * @apiUse OperationSuccess
 */
exports.deleteCommentFavor = (req, res, next) => {
    let cmId = req.params.cmId;
    let user = req.session.user.name;

    return weibo.deleteFavor('comment', cmId, user)
        .then(data => res.api(data)).catch(err => res.api_error(err.message));
};
