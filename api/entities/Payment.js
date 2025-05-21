const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  StaffId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  itemId: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'payment',
  timestamps: false
});

module.exports = Payment; 