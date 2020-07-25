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
    .query(q.Paginate(q.Match(q.Index("search_username"), loginArray[0])))
    .then((response) => {
      //getting back response data and flattening array
      client
        .query(
          q.Map(
            q.Paginate(q.Match(q.Index("all_values"))),
            q.Lambda(["title", "start", "end", "urgency"], {
              title: q.Var("title"),
              start: q.Var("start"),
              end: q.Var("end"),
              urgency: q.Var("urgency"),
            })
          )
        )
        .then((responser) => console.log(responser));
      console.log("original response   " + Object.values(response));
      const responseArray = flatDeep(response.data, Infinity);

      if (responseArray.length > 1) {
        //User found
        if (responseArray[1] === login.login.password) {
          //Password matched send back events
          console.log(
            "password matched" + "Response" + responseArray[2] + responseArray
          );
          return callback(null, {
            statusCode: 200,
            body: JSON.stringify(responseArray[2]),
          });
        } else {
          //Password denied suggest sign up
          console.log("password denied");

          return callback(null, {
            statusCode: 202,
            body: "Password failed",
          });
        }
      } else {
        //User not found create new one with this login info
        return client
          .query(q.Create(q.Ref("users"), login.login))
          .then((response) => {
            //created user
            console.log("created user");

            console.log(response);
            return callback(null, {
              statusCode: 201,
              body: JSON.stringify(`User Created ${response}`),
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
