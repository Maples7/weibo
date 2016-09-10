const Promise = require('bluebird');

const regexp = require('../enums/regexp');
const topicService = require('../services/topic');

module.exports = (wbId, content, options = {}) => {
    let topics = regexp.topic.exec(content);
    let atUsers = regexp.atUser.exec(content);
    return Promise.all([
        Promise.map(topics, topic => 
            topicService.addWeibo2Topic(wbId, topic, options)
        ),
        Promise.map(atUsers, atUser => {
            // TODO: Notice every atUser
        })
    ]);
};
