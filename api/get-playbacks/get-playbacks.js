const process = require("process");
const pool = require("../utils/db.js");

const handler = async (event) => {
    const uid = event.queryStringParameters.uid;

    /* no id, no go */
    if (!uid) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                data: "no broadcast id",
            }),
        };
    }

    try {
        // Query to count playbacks with the given prismic_id
        const [result] = await pool.execute(
            'SELECT COUNT(*) as count FROM playbacks WHERE show_prismic_id = ?',
            [uid]
        );

        // Extract the count from the result
        const playbackCount = result[0].count;

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "access-control-allow-origin": "*",
            },
            body: JSON.stringify(playbackCount),
        };
    } catch (error) {
        console.error("Error counting playbacks:", error);
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
