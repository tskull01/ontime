/* Import faunaDB sdk */
const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});

exports.handler = (event, context, callback) => {
  //get user and update array
  const data = JSON.parse(event.body);
  console.log(data.body);
  let requestObject = JSON.parse(data.body);
  console.log(requestObject.events);
  return client
    .query(
      q.Update(q.Ref(q.Collection(`users`), requestObject.currentUser), {
        data: {
          userEvents: requestObject.events,
        },
      })
    )
    .then((response) => {
      console.log("success", response.data.userEvents);
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    })
    .catch((error) => {
      console.log("error", error);
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      };
    });
};
