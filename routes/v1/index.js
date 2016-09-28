const express = require('express');
const check = require('../../middlewares/check');
const router = module.exports = express.Router();

router.use(require('./weibo'));
router.use(require('./user'));
router.use('/topics', require('./topic'));
router.use('./resourse', require('./resourse'));
router.use('./messages', check.checkLogin, require('./message'));
