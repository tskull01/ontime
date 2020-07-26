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
  return client
    .query(
      q.Update(q.Ref(q.Collection(`users`), requestObject.currentUser), {
        data: {
          userEvents: [
            {
              title: requestObject.title,
              start: requestObject.start,
              end: requestObject.end,
              urgency: requestObject.urgency,
            },
          ],
        },
      })
    )
    .then((response) => {
      console.log("success", response);
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
