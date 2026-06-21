require('dotenv').config();
const mysql = require('mysql2/promise');
const { createClient } = require('@sanity/client');

// Sanity client configuration
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
});

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

async function fetchSanityData() {
  try {
    const broadcasts = await sanityClient.fetch('*[_type == "broadcast"]');
    const users = await sanityClient.fetch('*[_type == "user"]');
    const playbacks = await sanityClient.fetch('*[_type == "playback"]');
    return { broadcasts, users, playbacks };
  } catch (error) {
    console.error('Error fetching from Sanity:', error);
    throw error;
  }
}

async function migrateUsers(connection, users) {
  for (const user of users) {
    try {
      await connection.execute(
        'INSERT INTO users (email, full_name) VALUES (?, ?)',
        [user.email, user.fullName]
      );
      console.log(`Migrated user: ${user.email}`);
    } catch (error) {
      console.error(`Error migrating user ${user.email}:`, error);
    }
  }
}

async function migrateBroadcasts(connection, broadcasts) {
  for (const broadcast of broadcasts) {
    try {
      await connection.execute(
        'INSERT INTO broadcasts (title, hosted_by, prismic_id, begin_time, end_time) VALUES (?, ?, ?, ?, ?)',
        [
          broadcast.title,
          broadcast.hostedBy,
          broadcast.prismicId,
          new Date(broadcast.begin),
          new Date(broadcast.end)
        ]
      );
      console.log(`Migrated broadcast: ${broadcast.title}`);
    } catch (error) {
      console.error(`Error migrating broadcast ${broadcast.title}:`, error);
    }
  }
}

async function migratePlaybacks(connection, playbacks) {
  for (const playback of playbacks) {
    try {
      await connection.execute(
        'INSERT INTO playbacks (reference_text, show_prismic_id, prismic_id, playback_date, timezone) VALUES (?, ?, ?, ?, ?)',
        [
          playback.referenceText,
          playback.showPrismicId,
          playback.prismicId,
          new Date(playback.date),
          playback.timezone || 'UTC'
        ]
      );
      console.log(`Migrated playback: ${playback.referenceText}`);
    } catch (error) {
      console.error(`Error migrating playback ${playback.referenceText}:`, error);
    }
  }
}

async function migrate() {
  let connection;
  try {
    // Create MySQL connection
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');

    // Fetch all data from Sanity
    const { broadcasts, users, playbacks } = await fetchSanityData();
    console.log(`Fetched data from Sanity:
      Users: ${users.length}
      Broadcasts: ${broadcasts.length}
      Playbacks: ${playbacks.length}
    `);

    // Migrate data
    await migrateUsers(connection, users);
    await migrateBroadcasts(connection, broadcasts);
    await migratePlaybacks(connection, playbacks);

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run migration
migrate();
