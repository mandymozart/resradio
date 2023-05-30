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
  const email = event.queryStringParameters.email;

  /* no id, no go */
  if (!email) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        data: "no sanity user id",
      }),
    };
  }

  try {
    const query = `*[email == "${email}"][0]{email,fullName}`;

    let user;

    await client.fetch(query).then((r) => {
      user = { email: r.email, fullName: r.fullName };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
      },
      body: JSON.stringify(user),
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
