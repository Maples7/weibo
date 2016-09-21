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
router.get('/users/info/:id', user.getInfo);
router.get('/users/name/:name', user.getInfoByName);
router.get('/users/acc/:acc', user.getInfoByAcc);
router.put('/users/info', user.modifyInfo);

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
router.get('/users/groups/:id', user.getGroups);
router.get('/users/member/:id/:gid', user.getGroupMember);

// 关系图图谱
router.post('/users/relationship', user.modifyRelationship);
router.put('/users/relationship', user.batchManage);
router.get('/users/follow/:id', user.getFollow);
router.get('/users/fans/:id', user.getFans);
router.get('/users/black', user.getBlack);  // 也可以用查分组成员的方法查黑名单成员
router.get('.users/comfollow/:id', user.getCommonFollow);
router.get('/users/comfans/:id', user.getCommonFans);