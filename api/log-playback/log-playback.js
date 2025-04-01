const process = require("process");
const pool = require("../utils/db.js");

const handler = async (event) => {

    const { uid, referenceText, hostedbyUid, date, timezone } = event.queryStringParameters

    /* no broadcast, no go */
    if (!uid) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                data: "no broadcast id",
            }),
        };
    }

    try {
        // Insert the new playback record into MySQL
        const [result] = await pool.execute(
            'INSERT INTO playbacks (reference_text, show_prismic_id, prismic_id, playback_date, timezone) VALUES (?, ?, ?, ?, ?)',
            [
                referenceText,
                hostedbyUid,
                uid,
                new Date(date),
                timezone || 'UTC'
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
                message: "Playback logged successfully"
            }),
        };
    } catch (error) {
        console.error("Error logging playback:", error);
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
