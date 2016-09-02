module.exports = (sequelize, DataTypes) => sequelize.define('Favor', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '点赞记录id'
    },
    itemId: {
        allowNull: false,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '被点赞的item Id'
    },
    itemType: {
        allowNull: false,
        type: DataTypes.ENUM('weibo', 'comment'),
        comment: '微博还是评论'
    },
    userName: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {model: 'Users', key: 'name'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: '发起点赞操作的用户名'
    },
    createTime: {
        allowNull: false,
        defaultValue: Date.now(),
        type: DataTypes.BIGINT.UNSIGNED,
        comment: '点赞时间'
    }
}, {
    timestamps: false,
    indexes: [{
        name: 'uniq_itemId_itemType_userName',
        fields: ['itemId', 'itemType', 'userName'],
        unique: true
    }]
});
