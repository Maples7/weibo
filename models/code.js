/**
 * Created by Ming Tse on 2016/8/17
 */
module.exports = (sequelize, DataTypes) => sequelize.define('Code', {
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    comment: '邮箱'
  },
  code: {
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED,
    comment: '验证码'
  },
  createTime: {
    allowNull: false,
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: Date.now(),
    comment: '创建时间'
  }
}, {
  indexes: [{
    name: 'uniq_email_create',
    fields: ['email', 'createTime'],
    unique: true
  }]
});