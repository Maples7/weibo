const qiniu = require('qiniu');
const config = require('config');

module.exports = new class {
    /**
     * 删除资源 
     */
    remove(fname) {
        qiniu.conf.ACCESS_KEY = config.get('qiniu.AK');
        qiniu.conf.SECRET_KEY = config.get('qiniu.SK');

        let client = new qiniu.rs.Client();

        return client.remove(config.get('qiniu.bucket'), fname);
    }

}();