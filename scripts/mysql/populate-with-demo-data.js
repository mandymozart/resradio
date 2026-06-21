require('dotenv').config();
const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');

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

// Configuration for the amount of dummy data to generate
const CONFIG = {
  USERS: 50,
  BROADCASTS: 30,
  PLAYBACKS: 100,
};

// Helper to generate a random date within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate dummy users
function generateUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      email: faker.internet.email(),
      fullName: faker.person.fullName(),
    });
  }
  return users;
}

// Generate dummy broadcasts
function generateBroadcasts(count) {
  const broadcasts = [];
  const hosts = [
    'John Smith',
    'Jane Doe',
    'Michael Johnson',
    'Sarah Williams',
    'Robert Brown',
  ];

  for (let i = 0; i < count; i++) {
    const beginTime = randomDate(new Date(2023, 0, 1), new Date());
    const endTime = new Date(beginTime);
    endTime.setHours(endTime.getHours() + Math.floor(Math.random() * 3) + 1);

    broadcasts.push({
      title: faker.music.songName(),
      hostedBy: faker.helpers.arrayElement(hosts),
      prismicId: faker.string.uuid(),
      begin: beginTime,
      end: endTime,
    });
  }
  return broadcasts;
}

// Generate dummy playbacks
function generatePlaybacks(count, broadcasts) {
  const playbacks = [];
  const timezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'];
  
  for (let i = 0; i < count; i++) {
    // Random broadcast to reference
    const randomBroadcast = faker.helpers.arrayElement(broadcasts);
    
    playbacks.push({
      referenceText: `Playback of "${randomBroadcast.title}"`,
      showPrismicId: randomBroadcast.prismicId,
      prismicId: faker.string.uuid(),
      date: randomDate(new Date(2023, 0, 1), new Date()),
      timezone: faker.helpers.arrayElement(timezones),
    });
  }
  return playbacks;
}

// Insert users into database
async function insertUsers(connection, users) {
  console.log(`Inserting ${users.length} users...`);
  for (const user of users) {
    try {
      await connection.execute(
        'INSERT INTO users (email, full_name) VALUES (?, ?)',
        [user.email, user.fullName]
      );
    } catch (error) {
      console.error(`Error inserting user ${user.email}:`, error.message);
    }
  }
  console.log('Users insertion completed');
}

// Insert broadcasts into database
async function insertBroadcasts(connection, broadcasts) {
  console.log(`Inserting ${broadcasts.length} broadcasts...`);
  for (const broadcast of broadcasts) {
    try {
      await connection.execute(
        'INSERT INTO broadcasts (title, hosted_by, prismic_id, begin_time, end_time) VALUES (?, ?, ?, ?, ?)',
        [
          broadcast.title,
          broadcast.hostedBy,
          broadcast.prismicId,
          broadcast.begin,
          broadcast.end
        ]
      );
    } catch (error) {
      console.error(`Error inserting broadcast ${broadcast.title}:`, error.message);
    }
  }
  console.log('Broadcasts insertion completed');
}

// Insert playbacks into database
async function insertPlaybacks(connection, playbacks) {
  console.log(`Inserting ${playbacks.length} playbacks...`);
  for (const playback of playbacks) {
    try {
      await connection.execute(
        'INSERT INTO playbacks (reference_text, show_prismic_id, prismic_id, playback_date, timezone) VALUES (?, ?, ?, ?, ?)',
        [
          playback.referenceText,
          playback.showPrismicId,
          playback.prismicId,
          playback.date,
          playback.timezone
        ]
      );
    } catch (error) {
      console.error(`Error inserting playback ${playback.referenceText}:`, error.message);
    }
  }
  console.log('Playbacks insertion completed');
}

async function populateDatabase() {
  let connection;
  try {
    // Create MySQL connection
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');

    // Generate dummy data
    const users = generateUsers(CONFIG.USERS);
    console.log(`Generated ${users.length} dummy users`);
    
    const broadcasts = generateBroadcasts(CONFIG.BROADCASTS);
    console.log(`Generated ${broadcasts.length} dummy broadcasts`);
    
    const playbacks = generatePlaybacks(CONFIG.PLAYBACKS, broadcasts);
    console.log(`Generated ${playbacks.length} dummy playbacks`);

    // Insert data into database
    await insertUsers(connection, users);
    await insertBroadcasts(connection, broadcasts);
    await insertPlaybacks(connection, playbacks);

    console.log('Database population completed successfully');
  } catch (error) {
    console.error('Database population failed:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the script
populateDatabase();