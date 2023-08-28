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
    const from = event.queryStringParameters.from;
    const to = event.queryStringParameters.to;

    /* no from, no go */
    if (!from) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                data: "no from date",
            }),
        };
    }
    if (!to) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                data: "no to date",
            }),
        };
    }

    try {
        const query = `*[_type == "broadcast"] | order(_updatedAt desc) [${from}...${to}]`;
        let broadcasts;

        await client.fetch(query).then((r) => {
            broadcasts = r;
        });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "access-control-allow-origin": "*",
            },
            body: JSON.stringify(broadcasts),
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
