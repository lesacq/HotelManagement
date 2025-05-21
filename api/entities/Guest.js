const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Guest = sequelize.define('Guest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  GuestId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  }
}, {
  tableName: 'guests',
  timestamps: false
});

module.exports = Guest; 