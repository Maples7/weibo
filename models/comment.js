module.exports = (sequelize, DataTypes) => sequelize.define('Comment', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '评论id'
    },
    author: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {model: 'Users', key: 'name'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: '评论作者'
    },
    weiboId: {
        allowNull: false,
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model: 'Weibos', key: 'id'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: '被评论的微博id'
    },
    replyId: {
        allowNull: true,
        type: DataTypes.INTEGER.UNSIGNED,
        references: {model: 'Comments', key: 'id'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: '该评论所回复的评论id'
    },
    content: {
        allowNull: false,
        type: DataTypes.TEXT,
        comment: '评论内容'
    },
    favorCount: {
        allowNull: false,
        defaultValue: 0,
        isInt: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '评论被点赞数'
    },
    createTime: {
        allowNull: false,
        defaultValue: Date.now(),
        type: DataTypes.BIGINT.UNSIGNED,
        comment: '评论创建时间'
    },
    deleteTime: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: '评论删除时间，0表示未删除；已删除的评论并不实际删除，只是记录删除时间作为标记'
    }
}, {
    timestamps: false
});
