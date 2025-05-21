const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ServiceId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  ServiceName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  inCharge: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'services',
  timestamps: false
});

module.exports = Service; 