const express = require('express');
const router = module.exports = express.Router();

const init_cache = require('../middlewares/initCache');

router.use('/v1', init_cache, require('./v1'));
