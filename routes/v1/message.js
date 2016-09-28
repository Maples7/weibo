const express = require('express');

const message = require('../../controllers/message');

const router = module.exports = express.Router();

router.route('/unhint')
    .get(message.getAllUnhintMessages);