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

// 修改个人信息
router.put('/users/info', user.modifyInfo);
// 关注、分组、拉黑相关，相应计数改变
router.put('/users/relationship', user.modifyRelationship);
// 发布/删除微博，计数改变
router.put('/users/weibocount', user.modifyWeiboCount);
// 修改分组信息
router.put('/users/modgroup', user.modifyGroup);
// 新建分组
router.post('/users/addgroup', user.addGroup);
// 删除分组
router.delete('/users/delgroup', user.delGroup);

router.get('/users/info', user.getInfo);
router.get('/users/follow', user.getFollow);
router.get('/users/fans', user.getFans);
router.get('/users/groups', user.getGroups);
router.get('/users/groupdetail', user.getGroupDetail);
router.get('/users/groupmember', user.getGroupMember);

// 发送验证邮件
router.get('/users/needmail', user.sendMail);
// 修改(验证/更换)邮箱
router.put('/users/email', user.modifyEmail);
// 修改密码
router.put('/users/password', user.modifyPassword);