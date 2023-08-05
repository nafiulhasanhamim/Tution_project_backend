
require("dotenv").config();

const { Client, Pool } = require("pg");
// const pool = new Client({
//     host : "localhost",
//     user:"postgres",
//     port:5432,
//     password:"nafiul1904hasan%#",
//     database:process.env.DATABASE

// });
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  })

pool.connect()
module.exports = pool;