const msgTypes = require('../enums/msgTypes');

module.exports = (sequelize, DataTypes) => sequelize.define('Message', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '消息id'
    },
    sender: {
        allowNull: false,
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model: 'Users', key: 'id'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: '消息发送者'
    },
    receiver: {
        allowNull: false,
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model: 'Users', key: 'id'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: '消息接收者'
    },
    itemId: {
        allowNull: false,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '产生消息的主体id'
    }, 
    itemType: {
        allowNull: false,
        type: DataTypes.ENUM(...msgTypes),
        comment: '消息的类型'
    },
    markRead: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
        comment: '是否已读'
    },
    markHint: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
        comment: '是否已提醒'
    },
    createTime: {
        allowNull: false,
        defaultValue: Date.now(),
        type: DataTypes.BIGINT.UNSIGNED,
        comment: '消息创建时间'
    }
}, {
    timestamps: false
});
