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

    const data = JSON.parse(event.body)
    const { id, title, hostedBy } = data

    /* no user, no go */
    if (!id) {
        console.log("No broadcast id!");
        return {
            statusCode: 401,
            body: JSON.stringify({
                data: "no broadcast id",
            }),
        };
    }

    let newBroadcast = {
        _type: "broadcast",
        title: event.queryStringParameters.title,
        hostedBy: event.queryStringParameters.hostedBy,
        id: event.queryStringParameters.id
    };

    console.log(newBroadcast)

    try {
        const result = await client.create(newBroadcast).then((res) => {
            console.log("RESULT FROM SANITY: ", res);
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.log(error);
        return {
            headers: { "Content-Type": "application/json" },
            statusCode: 500,
            body:
                error.responseBody || JSON.stringify({ error: "An error occurred" }),
        };
    }
};

module.exports = { handler };
