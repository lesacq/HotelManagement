const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ServiceRecord = sequelize.define('ServiceRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  RecordId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  GuestId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  StaffId: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'serviceRecords',
  timestamps: false
});

module.exports = ServiceRecord; 