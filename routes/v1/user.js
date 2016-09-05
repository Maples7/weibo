/**
 * Created by Ming Tse on 2016/7/14.
 */
const express = require('express');

const user = require('../../controllers/user');
const check = require('../../middlewares/check');

const router = module.exports = express.Router();

router.post('/register', user.register);
router.post('/login', user.login);
router.get('/logout', user.logout);

// 个人信息
router.get('/users/:id', user.getInfo);
router.get('/users/name/:name', user.getInfoByName);
router.put('/users/:id', user.modifyInfo);

// 邮箱与密码
router.get('/users/email', user.sendMail);
router.put('/users/email', user.modifyEmail);
router.put('/users/password', user.modifyPassword);
// 发布/删除微博，计数改变
router.put('/users/weibocount', user.modifyWeiboCount);

// 分组
router.post('/users/group', user.addGroup);
router.put('/users/group/:gid', user.modifyGroup);
router.delete('/users/group/:gid', user.delGroup);
router.get('/users/group/:gid', user.getGroupDetail);
router.get('/users/:id/groupmember/:gid', user.getGroupMember);
router.get('/users/:id/groups', user.getGroups);


// 关系图图谱
router.put('/users/:id/relationship', user.modifyRelationship);
router.get('/users/:id/follow', user.getFollow);
router.get('/users/:id/fans', user.getFans);
 // TO-DO
// router.get('.users/:id/comfollow', user.getCommonFollow);
// router.get('/users/:id/comfans', user.getCommonFans);