/**
 * Created by Maples7 on 2016/7/14.
 */
const express = require('express');

const weibo = require('../../controllers/weibo');
const weiboList = require('../../controllers/weiboList');
const check = require('../../middlewares/check');

const router = module.exports = express.Router();

// router.param('wbId', check.checkWeiboStatus);

router.route('/weibos/:wbId(\\d+)')
    .get(weibo.getWeiboDetail)
    .delete(check.checkLogin, weibo.deleteWeibo);

router.route('/weibos')
    .get(weiboList.getIndexWeiboList)
    .post(check.checkLogin, weibo.addWeibo);

router.route('/weibos/self')
    .get(check.checkLogin, weiboList.getSelfWeiboList);

router.route('/weibos/:wbId(\\d+)/comments')
    .get(weibo.getCommentList)
    .post(check.checkLogin, weibo.addComment);

router.route('/weibos/:wbId(\\d+)/forwardings')
    .get(weiboList.getForwardingWeiboList);

router.route('/comments/:cmId(\\d+)/favor')
    .all(check.checkLogin)
    .post(weibo.addCommentFavor)
    .delete(weibo.deleteCommentFavor);

router.route('/weibos/:wbId(\\d+)/favor')
    .all(check.checkLogin)
    .post(weibo.addWeiboFavor)
    .delete(weibo.deleteWeiboFavor); 

