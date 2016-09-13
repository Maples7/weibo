const qiniu = require('qiniu');
const config = require('config');

/**
 * @apiIgnore
 * @api {get} /resourse/upload-token 获取上传token
 * @apiName GetUploadToken
 * @apiGroup upload
 * @apiPermission LoginUser
 * @apiVersion 0.0.1
 * 
 * @apiUse GetUploadTokenSuccess
 */
exports.getUploadToken = (req, res, next) => {
    let fileName = '' + Date.now() + '-' + ~~(Math.random() * 1000);

    qiniu.conf.ACCESS_KEY = config.get('qiniu.AK');
    qiniu.conf.SECRET_KEY = config.get('qiniu.SK');

    return res.api((new qiniu.rs.PutPolicy(config.get('qiniu.bucket') + ":" + fileName)).token());
};

