require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ratelimit = require("express-rate-limit");
const xssClean = require('xss-clean');
const userrouter = require("./routes/user_routes/authroute");
const usercontrolrouter = require("./routes/admin_routes/usercontrolroute");
const postcontrolrouter = require("./routes/guardian_routes/postcontrolroute");
const adminpostcontrolrouter = require("./routes/admin_routes/postcontrolroute");

const app = express();
const ratelimiter = ratelimit({
  windowMs : 1*60*1000,
  max : 5,
  message : 'Too many request..Please try again later'
});


app.use(xssClean())
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(ratelimiter);


// home route
app.get("/", (req, res) => {
  res.send("<h1> Welcome to the server </h1>");
});

app.use("/",userrouter);
app.use("/",usercontrolrouter)
app.use("/",postcontrolrouter)
app.use("/",adminpostcontrolrouter)

//resource not found
app.use((req, res, next) => {
  res.status(404).json({
    message: "route not found",
  });
});


//server error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;