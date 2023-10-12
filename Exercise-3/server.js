// Import environment variables from .env at runtime
require('dotenv').config();

// SQL Server Setup
const sql = require('mssql');
const config = {
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  server: process.env.DATABASE_SERVER,
  database: process.env.DATABASE_INITIAL_DB,
  port: parseInt(process.env.DATABASE_PORT),
  options: { encrypt: false }
}

const express = require('express');
const app = express();

const APP_PORT = 3000;

app.get("/", function (req, res) {
  sql.connect(config, function (err) {
    if (err) console.log(err);
    var request = new sql.Request();
    request.query('select * from Studentinfo', function (err, recordset) {
      if (err) console.log(err);
      res.send(recordset);
    });
  });
});

app.listen(APP_PORT, function() {
  console.log(`[-] INFO :: Application started on port ${APP_PORT}`);
})