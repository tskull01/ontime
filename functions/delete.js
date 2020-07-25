/* Import faunaDB sdk */
const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});

exports.handler = (event, context, callback) => {
  client
    .query(q.Paginate(q.Documents(q.Collection("users")), { size: 5 }))
    .then((response) => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response),
      });
    })
    .catch((error) => {
      console.log("error", error);
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      };
    });
};
