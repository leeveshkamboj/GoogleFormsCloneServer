const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');

const config = require("./config");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions ={
    origin:'http://localhost:3000', 

}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/user", require("./routes/user"));
app.use("/", require("./routes"));

if (config.dbUrl) {
  mongoose
    .connect(config.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("> Database connected.");
      server = app.listen(config.port, () => {
        console.log(`> Listening at port ${config.port}.`);
      });
    })
    .catch((err) => {
      console.log(`Error while connecting to database\n${err}`);
    });
} else {
  console.log("Empty Database URL.");
}
