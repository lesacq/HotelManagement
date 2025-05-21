const sequelize = require('../config/db');
const Staff = require('./Staff');
const Guest = require('./Guest');
const Service = require('./Service');
const Room = require('./Room');
const Booking = require('./Booking');
const ServiceRecord = require('./ServiceRecord');
const Payment = require('./Payment');

// Define associations
Service.belongsTo(Staff, { foreignKey: 'inCharge', targetKey: 'StaffId' });

Booking.belongsTo(Guest, { foreignKey: 'GuestId', targetKey: 'GuestId' });
Booking.belongsTo(Staff, { foreignKey: 'StaffId', targetKey: 'StaffId' });
Booking.belongsTo(Room, { foreignKey: 'roomNumber', targetKey: 'roomNumber' });

ServiceRecord.belongsTo(Guest, { foreignKey: 'GuestId', targetKey: 'GuestId' });
ServiceRecord.belongsTo(Staff, { foreignKey: 'StaffId', targetKey: 'StaffId' });

Payment.belongsTo(Staff, { foreignKey: 'StaffId', targetKey: 'StaffId' });

// Sync all models with the database
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
}

// Initialize database
syncDatabase();

module.exports = {
  Staff,
  Guest,
  Service,
  Room,
  Booking,
  ServiceRecord,
  Payment,
  sequelize
}; 