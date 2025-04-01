const process = require("process");
const pool = require("../utils/db.js");

const handler = async (event) => {
  const email = event.queryStringParameters.email;

  /* no email, no go */
  if (!email) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: "no user email provided",
      }),
    };
  }

  try {
    // Use the MySQL connection pool to query the database
    const [rows] = await pool.execute(
      'SELECT email, full_name as fullName FROM users WHERE email = ?',
      [email]
    );

    // If no user is found, rows will be an empty array
    const user = rows.length > 0 
      ? { email: rows[0].email, fullName: rows[0].fullName }
      : { email: null, fullName: null };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
      },
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
      },
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};

module.exports = { handler };
