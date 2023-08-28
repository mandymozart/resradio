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

    let newPlayback = {
        _type: "playback",
        referenceText: referenceText,
        showPrismicId: hostedbyUid,
        prismicId: uid,
        date: date,
        timezone: timezone,
    };

    try {
        const result = await client.create(newPlayback).then((res) => {
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
