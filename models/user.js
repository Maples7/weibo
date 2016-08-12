module.exports = (sequelize, DataTypes) => sequelize.define('User', {
    name: {
        allowNull: false,
        primaryKey: true,
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
    weiboCount: {
        allowNull: false,
        defaultValue: 0,
        isInt: true,
        type: DataTypes.INTEGER.UNSIGNED,
        comment: '用户所发微博数'
    },
    createTime: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.BIGINT.UNSIGNED,
        comment: '用户创建时间，0表示用户账户未激活（邮箱未验证），激活后为激活的具体时间'
    }
}, {
    timestamps: false
})