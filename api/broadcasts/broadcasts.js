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
        const query = `*[_type == "broadcast" && dateTime(begin) < dateTime('${beginBefore}') && dateTime(end) > dateTime('${endAfter}')] | order(beginBefore desc) [${from}...${to}]`;
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
