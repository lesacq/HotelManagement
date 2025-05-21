const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  StaffId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  position: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'staff',
  timestamps: false,
  hooks: {
    beforeCreate: async (staff) => {
      if (staff.password) {
        staff.password = await bcrypt.hash(staff.password, 10);
      }
    },
    beforeUpdate: async (staff) => {
      if (staff.changed('password')) {
        staff.password = await bcrypt.hash(staff.password, 10);
      }
    }
  }
});

module.exports = Staff; 