module.exports = (sequelize, DataTypes) => sequelize.define('Weibo', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '微博id'
    },
    author: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {model: 'Users', key: 'name'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: '微博发起人'
    },
    content: {
        allowNull: false,
        type: DataTypes.TEXT,
        comment: '微博内容：如果是转发，则为自己添加的内容，被转发的微博通过forwardId字段获得'
    },
    forwardId: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model: 'Weibos', key: 'id'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: '当该微博为转发时，被转发微博id'
    },
    originalId: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model: 'Weibos', key: 'id'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: '当该微博被转发时，转发链顶端的微博id'
    },
    from: {
        allowNull: false,
        defaultValue: '',
        type: DataTypes.STRING,
        comment: '微博来自于哪的客户端信息描述'
    },
    favorCount: {
        allowNull: false,
        defaultValue: 0,
        isInt: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '微博被点赞数'
    },
    forwardCount: {
        allowNull: false,
        defaultValue: 0,
        isInt: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '微博被转发数'
    },
    commentCount: {
        allowNull: false,
        defaultValue: 0,
        isInt: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '微博被评论数'
    },
    readCount: {
        allowNull: false,
        defaultValue: 0,
        isInt: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '微博阅读数'
    },
    creatTime: {
        allowNull: false,
        defaultValue: Date.now(),
        type: DataTypes.BIGINT.UNSIGNED,
        comment: '微博创建时间'
    },
    deleteTime: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: '微博删除时间，0表示未删除；已删除的微博并不实际删除，只是记录删除时间作为标记'
    }
}, {
    timestamps: false
});
