module.exports = (sequelize, DataTypes) => sequelize.define('Relationship', {
  fans: {
    allowNull: false,
    type: DataTypes.STRING,
    references: {model: 'Users', key: 'name'},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: '粉丝'
  },
  follow: {
    allowNull: false,
    type: DataTypes.STRING,
    references: {model: 'Users', key: 'name'},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: '被关注者',
  },
  remark: {
    allowNull: true,
    type: DataTypes.STRING,
    comment: '被关注者备注名'
  },
  group: {
    allowNull: true,
    type: DataTypes.STRING,
    comment: '被关注者分组'
  }
}, {
  indexes: [{
    name: 'uniq_fans_follow_group',
    fields: ['fans', 'follow', 'group'],
    unique: true
  }]
});