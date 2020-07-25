/* Import faunaDB sdk */
const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});
function flatDeep(arr, d = 1) {
  return d > 0
    ? arr.reduce(
        (acc, val) =>
          acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val),
        []
      )
    : arr.slice;
}
exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const login = {
    login: JSON.parse(data.body),
  };
  const loginArray = [login.login.username];
  return client
    .query(
      q.Map(
        q.Paginate(q.Match(q.Index("search_ref_username"), loginArray[0])),
        q.Lambda("user", q.Get(q.Var("user")))
      )
    )
    .then((response) => {
      //getting back response data and flattening array
      if (response.data[0]) {
        const responseObject = response.data[0].data;
        if (login.login.password === responseObject.password) {
          //user logged in successfully and return user events
          return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
              ref: response.data[0].ref,
              events: responseObject.userEvents,
            }),
          });
        } else {
          //wrong password
          return callback(null, {
            statusCode: 201,
            body: JSON.stringify({ message: "Password invalid", status: 201 }),
          });
        }
      } else {
        //user doesn't exist create one
        return client
          .query(
            q.Create(q.Collection("users"), {
              data: {
                username: login.login.username,
                password: login.login.password,
                userEvents: [],
              },
            })
          )
          .then((response) => {
            //created user
            console.log("created user");
            console.log(response);
            return callback(null, {
              statusCode: 201,
              body: JSON.stringify(response),
            });
          });
      }
    })
    .catch((error) => {
      console.log("error", error);
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error),
      });
    });
};
