const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Journal = sequelize.define('Journal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entries: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'date']
    }
  ]
});

module.exports = Journal; 