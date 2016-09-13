const express = require('express');

const upload = require('../../controllers/resourse');
const check = require('../../middlewares/check');

const router = module.exports = express.Router();

router.route('/upload-token')
    .get(check.checkLogin, upload.getUploadToken);
    