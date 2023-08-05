const userrouter = require("express").Router();
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const ratelimit = require("express-rate-limit");
const { registerUser, loginUser, logout, verifyTokenfrontend } = require("../../controllers/user_controllers/authcontroller");

const ratelimiter = ratelimit({
    windowMs : 1*60*1000,
    max : 5,
    message : 'Too many request..Please try again later'
  });

  
userrouter.use(passport.initialize());
// register route
userrouter.post("/register", ratelimiter,registerUser);

// login route
userrouter.post("/login",ratelimiter,loginUser);
userrouter.post("/logout",logout);
userrouter.get("/verifytoken",verifyTokenfrontend);

module.exports = userrouter;