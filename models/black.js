module.exports = (sequelize, DataTypes) => sequelize.define('Black', {
  id: {
    allowNull: false,
    type: DataTypes.INTEGER(100),
    autoIncrement: true,
    primaryKey: true,
    comment: '单向拉黑关系id'
  },
  fans: {
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED,
    references: {model: 'Users', key: 'id'},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: '拉黑者'
  },
  follow: {
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED,
    references: {model: 'Users', key: 'id'},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: '被拉黑者',
  },
  group: {
    allowNull: true,
    type: DataTypes.INTEGER(255),
    references: {model: 'Groups', key: 'id'},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: '拉黑者黑名单分组id'
  }
}, {
  indexes: [{
    name: 'uniq_fans_follow',
    fields: ['fans', 'follow'],
    unique: true
  }]
});