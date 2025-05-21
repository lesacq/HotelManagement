const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  BookingId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  Status: {
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
  },
  roomNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  checkInDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  checkOutDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'bookings',
  timestamps: false
});

module.exports = Booking; 