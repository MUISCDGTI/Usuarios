const app = require("./index");
const dbConnect = require("./db");

const port = 3000;

dbConnect().then(
  () => {
    app.listen(port);
    console.log('Server ready!');
  },
  err => {
    console.log('Connection error: ' + err);
  }
);