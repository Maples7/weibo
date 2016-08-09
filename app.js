const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('config');
const expressSession = require('express-session');
const sessionStore = require('connect-redis')(expressSession);
const _ = require('lodash');

const routes = require('./routes');
const db = require('./models');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession(_.merge(config.get('session'), {
    store: new sessionStore({
        host: config.get('redis.host'),
        port: config.get('redis.port'),
        db: config.get('redis.sessionDB')
    })
})));

db.sequelize.sync({force: config.get('mysql.forceSync')}).catch(err => {
    console.log('MySQL sync with Sequelize is failure: ', err);
    process.exit(1);
});

// app.use(routes);
// app.use(notFound);

module.exports = app;
