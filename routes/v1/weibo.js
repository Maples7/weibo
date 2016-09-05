/**
 * Created by Maples7 on 2016/7/14.
 */
const express = require('express');

const weibo = require('../../controllers/weibo');
const weiboList = require('../../controllers/weiboList');
const check = require('../../middlewares/check');

const router = module.exports = express.Router();

// router.param('wbId', check.checkWeiboStatus);

// 单条微博相关

router.route('/weibos/:wbId(\\d+)')
    .get(weibo.getWeiboDetail)
    .delete(check.checkLogin, weibo.deleteWeibo);

router.route('/weibos')
    .post(check.checkLogin, weibo.addWeibo);

router.route('/weibos/:wbId(\\d+)/comments')
    .get(weibo.getCommentList)
    .post(check.checkLogin, weibo.addComment);

router.route('/comments/:cmId(\\d+)/favor')
    .all(check.checkLogin)
    .post(weibo.addCommentFavor)
    .delete(weibo.deleteCommentFavor);

router.route('/weibos/:wbId(\\d+)/favor')
    .all(check.checkLogin)
    .post(weibo.addWeiboFavor)
    .delete(weibo.deleteWeiboFavor); 

// 微博列表相关

// router.get('/weibos', weiboList.getWeiboList);
