const status = require('../enums/resStatus');

module.exports = (req, res, next) => res.api(...status.apiNotFound);
