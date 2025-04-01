const process = require("process");
const pool = require("../utils/db.js");

const handler = async (event) => {
    let from = event.queryStringParameters.from;
    let to = event.queryStringParameters.to;
    const beginBefore = event.queryStringParameters.beginBefore;
    const endAfter = event.queryStringParameters.endAfter;

    if (!from) {
        from = 0;
    }
    if (!to) {
        to = 0
    }

    if (!beginBefore) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                data: "no beginBefore",
            }),
        };
    }
    if (!endAfter) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                data: "no endAfter",
            }),
        };
    }

    try {
        // Calculate the LIMIT and OFFSET for pagination
        const limit = to - from;
        const offset = from;

        // MySQL query to get broadcasts within the specified time range
        const [broadcasts] = await pool.execute(
            `SELECT * FROM broadcasts 
             WHERE begin_time < ? AND end_time > ? 
             ORDER BY begin_time DESC
             ${limit > 0 ? 'LIMIT ? OFFSET ?' : ''}`,
            limit > 0 
                ? [new Date(beginBefore), new Date(endAfter), limit, offset]
                : [new Date(beginBefore), new Date(endAfter)]
        );

        // Transform the result to match the expected format
        const formattedBroadcasts = broadcasts.map(broadcast => ({
            title: broadcast.title,
            hostedBy: broadcast.hosted_by,
            prismicId: broadcast.prismic_id,
            begin: broadcast.begin_time,
            end: broadcast.end_time
        }));

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "access-control-allow-origin": "*",
            },
            body: JSON.stringify(formattedBroadcasts),
        };
    } catch (error) {
        console.error("Error fetching broadcasts:", error);
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
