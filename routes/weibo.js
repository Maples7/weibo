/**
 * Created by Maples7 on 2016/7/14.
 */
const express = require('express');

const weibo = require('../controllers/weibo');
const weiboList = require('../controllers/weiboList');
const check = require('../middlewares/check');

const router = module.exports = express.Router();

router.param('wbId', check.checkWeiboStatus);

router.get('/weibos/:wbId', weibo.getWeiboDetail);
router.post('/weibos', check.checkLogin, weibo.addWeibo);
router.delete('/weibos/:wbId', check.checkLogin, weibo.deleteWeibo);

router.get('/weibos/:wbId/comments', weibo.getWeiboCommentList);
router.post('/weibos/:wbId/comments', check.checkLogin, weibo.addWeiboComment);

router.post('/weibos/:wbId/favor', check.checkLogin, weibo.addWeiboFavor);
router.delete('/weibo/:wbId/favor', check.checkLogin, weibo.deleteWeiboFavor);
