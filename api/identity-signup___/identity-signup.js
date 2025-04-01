const process = require('process')
const pool = require('../utils/db.js');

const handler = async function (event) {
  const data = JSON.parse(event.body)
  const { user } = data

  /* 
    prepare data to pass through to netlify as user is created
  */
  const netlifyResponseBody = {
    app_metadata: {
      roles: ['basic'],
      app_other_thing: 'some app value'
    },
    user_metadata: {
      user_other_thing: 'some user value'
    },
  }

  try {
    // Check if user already exists to implement createIfNotExists behavior
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [user.email]
    );

    // Only create user if they don't already exist
    if (existingUsers.length === 0) {
      // Insert the new user into MySQL
      const [result] = await pool.execute(
        'INSERT INTO users (email, full_name) VALUES (?, ?)',
        [user.email, user.user_metadata?.full_name || ""]
      );
      
      console.log('USER CREATED IN MYSQL:', {
        id: result.insertId,
        email: user.email
      });
    } else {
      console.log('USER ALREADY EXISTS IN MYSQL:', user.email);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(netlifyResponseBody),
    }
  } catch (error) {
    console.error('Error creating user in MySQL:', error);
    return {
      headers: { 'Content-Type': 'application/json' },
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred' }),
    }
  }
}

module.exports = { handler }
