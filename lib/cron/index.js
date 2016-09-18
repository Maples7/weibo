const CronJob = require('cron').CronJob;
const weiboService = require('../../services/weibo');

module.exports = () => {
    new CronJob({
        cronTime: '00 30 03 * * *',     // 每天凌晨 3:30
        onTick: () => weiboService.syncWeiboReadCount(), 
        start: true
    });
};
