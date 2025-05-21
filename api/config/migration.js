const mysql = require('mysql2/promise');
const { sequelize } = require('../entities');
const dotenv = require('dotenv');

dotenv.config();

// MySQL connection config
const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: 'emma1234',
  database: 'hotel'
};

// Function to migrate data from MySQL to PostgreSQL
async function migrateData() {
  let mysqlConnection;
  
  try {
    // Connect to MySQL
    console.log('Connecting to MySQL database...');
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('Connected to MySQL successfully.');

    // Tables to migrate in order (respect foreign key constraints)
    const tables = [
      'staff',
      'guests',
      'rooms',
      'services',
      'bookings',
      'serviceRecords',
      'payment'
    ];

    // Migrate each table
    for (const table of tables) {
      console.log(`Migrating ${table}...`);
      
      // Get data from MySQL
      const [rows] = await mysqlConnection.query(`SELECT * FROM ${table}`);
      
      if (rows.length === 0) {
        console.log(`No data to migrate for ${table}.`);
        continue;
      }
      
      // Convert table name to model name (singular and capitalized)
      let modelName;
      if (table === 'payment') {
        modelName = 'Payment';
      } else if (table === 'serviceRecords') {
        modelName = 'ServiceRecord';
      } else {
        // Remove trailing 's' for singular
        modelName = table.charAt(0).toUpperCase() + table.slice(1);
        if (modelName.endsWith('s')) {
          modelName = modelName.slice(0, -1);
        }
      }
      
      // Get the Sequelize model
      const Model = sequelize.models[modelName];
      
      if (!Model) {
        console.error(`Model ${modelName} not found!`);
        continue;
      }
      
      // Insert data into PostgreSQL using bulk create
      await Model.bulkCreate(rows, { 
        ignoreDuplicates: true 
      });
      
      console.log(`${rows.length} records migrated for ${table}.`);
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close connections
    if (mysqlConnection) {
      await mysqlConnection.end();
      console.log('MySQL connection closed.');
    }
  }
}

module.exports = { migrateData };

// If this file is run directly, execute the migration
if (require.main === module) {
  migrateData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
} 