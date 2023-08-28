const process = require("process");

const { createClient } = require("@sanity/client");

const client = createClient({
    projectId: process.env.SANITY_PROJECT,
    dataset: process.env.SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: "2022-01-01",
    useCdn: false,
});

const handler = async (event) => {
    const uid = event.queryStringParameters.uid;

    /* no id, no go */
    if (!uid) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                data: "no sanity broadcast id",
            }),
        };
    }

    try {
        const query = `*[prismicId == "${uid}"]{referenceText,date,timezone}`;

        let playbacks;

        await client.fetch(query).then((r) => {
            playbacks = r.length;
        });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "access-control-allow-origin": "*",
            },
            body: JSON.stringify(playbacks),
        };
    } catch (error) {
        return {
            headers: {
                "Content-Type": "application/json",
                "access-control-allow-origin": "*",
            },
            statusCode: 500,
            body:
                error.responseBody || JSON.stringify({ error: "An error occurred" }),
        };
    }
};

module.exports = { handler };
