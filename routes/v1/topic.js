const express = require('express');

const topic = require('../../controllers/topic');

const router = module.exports = express.Router();

router.route('/hot')
    .get(topic.getHotTopics);

router.route('/:topicName')
    .get(topic.getTopicWeibos);
