/* Import faunaDB sdk */
const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});

exports.handler = async (event, context) => {
  const username = event.username;
  const password = event.password;
  return client
    .query(q.Get(q.Ref(`ontime/users/${username}`)))
    .then((response) => {
      if (password === response.password) {
        return {
          statusCode: 200,
          body: JSON.stringify(response),
        };
      } else {
        return {
          statusCode: 201,
          body: JSON.stringify("Incorrect Password"),
        };
      }
    })
    .catch((error) => {
      console.log("error", error);
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      };
    });
};
