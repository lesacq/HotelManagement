const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  roomNumber: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Regular', 'Deluxe'),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('available', 'occupied'),
    allowNull: false,
    defaultValue: 'available'
  }
}, {
  tableName: 'rooms',
  timestamps: false
});

module.exports = Room; 