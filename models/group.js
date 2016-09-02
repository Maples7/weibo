module.exports = (sequelize, DataTypes) => sequelize.define('Group', {
  id: {
    allowNull: false,
    type: DataTypes.INTEGER(100),
    autoIncrement: true,
    primaryKey: true,
    comment: '分组id'
  },
  creator: {
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED,
    references: {model: 'Users', key: 'id'},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: '分组创建者'
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    comment: '分组名'
  },
  description: {
    allowNull: true,
    type: DataTypes.STRING,
    comment: '分组描述'
  },
  public: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: '是否公开'
  }
  // member: {
  //   allowNull: true,
  //   type: DataTypes.STRING,
  //   comment: '分组成员(数组)'
  // }
}, {
  indexes: [{
    name: 'uniq_creator_name',
    fields: ['creator', 'name'],
    unique: true
  }]
});