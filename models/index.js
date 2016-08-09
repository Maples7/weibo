const Sequelize = require('sequelize');
const config = require('config');
const _ = require('lodash');

let models = {
    // weibo: './weibo'
};

let sequelize = new Sequelize(config.get('mysql.database'), config.get('mysql.user'), config.get('mysql.password'), {
    host: config.get('mysql.host'),
    port: config.get('mysql.port'),
    dialect: 'mysql',
    timezone: config.get('mysql.timeZone'),
    dialectOptions: {
        charset: 'UTF8MB4_GENERAL_CI'
    }
});

sequelize.authenticate().then((msg) => {
    console.log('MySQL Connection with Sequelize has been established successfully.\n');
}).catch((err) => {
    console.log('Unable to connect to the database: ', err);
});

for (let model in models) {
    models[model] = sequelize.import(models[model]);
}

module.exports = _.merge(models, {
    sequelize: sequelize
});