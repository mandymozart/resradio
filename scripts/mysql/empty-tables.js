require('dotenv').config();
const mysql = require('mysql2/promise');
const process = require('process');

// MySQL configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Function to get user input
function getUserInput() {
  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', (data) => {
      process.stdin.pause();
      resolve(data.toString().trim().toLowerCase());
    });
  });
}

// Function to prompt user for confirmation
async function promptUser(question) {
  process.stdout.write(question);
  return await getUserInput();
}

// Function to empty all tables
async function emptyTables() {
  let connection;
  try {
    // Create MySQL connection
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');

    // Get the database name
    const dbName = process.env.DB_NAME;
    
    // Get all table names
    const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [dbName]);
    
    // If no tables found
    if (tables.length === 0) {
      console.log('No tables found in the database.');
      process.exit(0);
    }
    
    // List the tables to be emptied
    console.log('\nThe following tables will be emptied:');
    tables.forEach((table) => {
      console.log(`- ${table.TABLE_NAME}`);
    });
    
    // Prompt for confirmation
    const answer = await promptUser('\nWARNING: This action will delete ALL data from these tables. Continue? (yes/no): ');
    
    if (answer !== 'yes') {
      console.log('Operation cancelled.');
      process.exit(0);
    }
    
    // Disable foreign key checks temporarily
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Truncate each table
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      try {
        await connection.query(`TRUNCATE TABLE ${tableName}`);
        console.log(`Table ${tableName} emptied successfully.`);
      } catch (error) {
        console.error(`Error emptying table ${tableName}:`, error.message);
      }
    }
    
    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('\nAll tables have been emptied successfully.');
    
  } catch (error) {
    console.error('Operation failed:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
    process.exit(0);
  }
}

// Display warning banner
console.log(`
╔════════════════════════════════════════════════════════════╗
║                        ⚠️  WARNING ⚠️                        ║
║                                                            ║
║  This script will REMOVE ALL DATA from database tables.    ║
║  This action CANNOT be undone.                             ║
║  Make sure you have backups if needed before proceeding.   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);

// Run the script
emptyTables();