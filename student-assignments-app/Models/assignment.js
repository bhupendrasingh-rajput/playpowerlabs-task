const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const User = require('./user');

const Assignment = sequelize.define('Assignment', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  totalScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    references: {
      model: User,
      key: 'username'
    }
  }
});

module.exports = Assignment;
