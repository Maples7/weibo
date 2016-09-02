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

router.get('/weibos/:wbId(\\d+)', weibo.getWeiboDetail);
router.post('/weibos', check.checkLogin, weibo.addWeibo);
router.delete('/weibos/:wbId(\\d+)', check.checkLogin, weibo.deleteWeibo);

router.get('/weibos/:wbId(\\d+)/comments', weibo.getCommentList);
router.post('/weibos/:wbId(\\d+)/comments', check.checkLogin, weibo.addComment);
router.post('/comments/:cmId(\\d+)/favor', check.checkLogin, weibo.addCommentFavor);
router.delete('/comments/:cmId(\\d+)/favor', check.checkLogin, weibo.deleteCommentFavor);

router.post('/weibos/:wbId(\\d+)/favor', check.checkLogin, weibo.addWeiboFavor);
router.delete('/weibos/:wbId(\\d+)/favor', check.checkLogin, weibo.deleteWeiboFavor);

// 微博列表相关

// router.get('/weibos', weiboList.getWeiboList);
