const express = require('express');
const router = module.exports = express.Router();

router.use(require('./weibo'));
router.use(require('./user'));
router.use('/topics', require('./topic'));
router.use('./resourse', require('./resourse'));
