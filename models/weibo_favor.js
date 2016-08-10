module.exports = (sequelize, DataTypes) => sequelize.define('WeiboFavor', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '微博点赞记录id'
    },
    weiboId: {
        allowNull: false,
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model: 'Weibos', key: 'id'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: '被点赞的微博id'
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
        name: 'uniq_weiboId_userName',
        fields: ['weiboId', 'userName'],
        unique: true
    }]
});
