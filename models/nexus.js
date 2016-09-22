module.exports = (sequelize, DataTypes) => sequelize.define('Nexus', {
  id: {
    allowNull: false,
    type: DataTypes.INTEGER(100),
    autoIncrement: true,
    primaryKey: true,
    comment: '单向关注关系id'
  },
  fans: {
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED,
    references: {model: 'Users', key: 'id'},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: '关注者'
  },
  follow: {
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED,
    references: {model: 'Users', key: 'id'},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: '被被关注者',
  },
  remark: {
    allowNull: true,
    type: DataTypes.STRING,
    comment: '被关注者备注名'
  },
  group: {
    allowNull: true,
    type: DataTypes.INTEGER(255),
    references: {model: 'Groups', key: 'id'},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: '关注者“全部关注”分组id'
  }
}, {
  indexes: [{
    name: 'uniq_fans_follow',
    fields: ['fans', 'follow'],
    unique: true
  }]
});