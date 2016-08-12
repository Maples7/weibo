/**
 * Created by Maples7 on 2016/7/14.
 */
const express = require('express');

const user = require('../controllers/user');
const check = require('../middlewares/check');

const router = module.exports = express.Router();

router.post('/users/register', user.register);
router.post('/users/login', user.login);
router.get('/users/logout', user.logout);

// 修改密码/个人信息
router.put('/users/password', user.modifyPassword);
router.put('/users/change', user.modify);
// 添加/取消关注，相应计数改变
router.put('/users/relationship', user.modifyRelationship);
// 发布/删除微博，计数改变
router.put('/users/weibo', user.modifyWeiboCount);