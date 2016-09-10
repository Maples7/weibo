module.exports = (sequelize, DataTypes) => sequelize.define('Topic', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '话题id'
    },
    name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
        comment: '话题名'
    },
    weiboIds: {
        allowNull: false,
        type: DataTypes.TEXT,
        defaultValue: '[]',
        comment: '该话题下的微博集合'
    },
    readCount: {
        allowNull: false,
        defaultValue: 0,
        isInt: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '话题阅读数'
    },
    creatTime: {
        allowNull: false,
        defaultValue: Date.now(),
        type: DataTypes.BIGINT.UNSIGNED,
        comment: '话题创建时间'
    }
}, {
    timestamps: false
});
