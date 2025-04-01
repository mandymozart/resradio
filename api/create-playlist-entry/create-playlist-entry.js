const process = require("process");
const pool = require("../utils/db.js");

const handler = async (event) => {

    const { uid, title, hostedby, begin, end } = event.queryStringParameters

    /* no user, no go */
    if (!uid) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                data: "no broadcast id",
            }),
        };
    }

    try {
        // Insert the new broadcast record into MySQL
        const [result] = await pool.execute(
            'INSERT INTO broadcasts (title, hosted_by, prismic_id, begin_time, end_time) VALUES (?, ?, ?, ?, ?)',
            [
                title,
                hostedby,
                uid,
                new Date(begin),
                new Date(end)
            ]
        );

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "access-control-allow-origin": "*" 
            },
            body: JSON.stringify({
                id: result.insertId,
                message: "Broadcast created successfully"
            }),
        };
    } catch (error) {
        console.error("Error creating broadcast:", error);
        return {
            headers: { 
                "Content-Type": "application/json",
                "access-control-allow-origin": "*" 
            },
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred" }),
        };
    }
};

module.exports = { handler };
