module.exports = (sequelize, DataTypes) => sequelize.define('User', {
    id: {
        allowNull: false,
        unique: true,
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        comment: '用户id'
    },
    name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
        comment: '用户名，唯一'
    },
    email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
        comment: '用户邮箱，唯一'
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING,
        comment: '用户密码，crypt加密'
    },
    headPic: {
        allowNull: true,
        type: DataTypes.STRING,
        comment: '用户头像地址'
    },
    sex: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        comment: '用户性别，男true/女false'
    },
    bio: {
        allowNull: true,
        type: DataTypes.TEXT('tiny'),
        comment: '用户简介'
    },
    fansCount: {
        allowNull: false,
        defaultValue: 0,
        isInt: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '用户粉丝数'
    },
    followCount: {
        allowNull: false,
        defaultValue: 0,
        isInt: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '用户关注(其他用户)数'
    },
    blackCount: {
        allowNull: false,
        defaultValue: 0,
        isInt: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '用户黑名单人数'
    },
    notCount: {
        allowNull: false,
        defaultValue: 0,
        isInt: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '用户未分组关注数'
    },
    weiboCount: {
        allowNull: false,
        defaultValue: 0,
        isInt: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '用户所发微博数'
    },
    weiboUpdate: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: '最近微博时间'
    },
    createTime: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: '用户创建时间'
    },
    emailConfirm: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
        comment: '用户邮箱是否已验证'
    }
}, {
    timestamps: false
})