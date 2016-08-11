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
