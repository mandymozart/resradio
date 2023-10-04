const process = require("process");

const { createClient } = require("@sanity/client");
console.log(process.env)
const client = createClient({
    projectId: process.env.SANITY_PROJECT,
    dataset: process.env.SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: "2022-01-01",
    useCdn: false,
});

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

    let newBroadcast = {
        _type: "broadcast",
        title: title,
        hostedBy: hostedby,
        prismicId: uid,
        begin: begin,
        end: end
    };

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
        return {
            headers: { "Content-Type": "application/json" },
            statusCode: 500,
            body:
                error.responseBody || JSON.stringify({ error: "An error occurred" }),
        };
    }
};

module.exports = { handler };
