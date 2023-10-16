// Import environment variables from .env at runtime
require('dotenv').config();

// Global Constants
const APP_PORT = process.env.APP_PORT;
const APP_HOST = process.env.APP_HOST;

// Utilities
const path = require('path');
const multer = require('multer');
const util = require('util');
const { json } = require('body-parser');

// SQL Server Setup
const sql = require('mssql');
const dbConfig = {
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  server: process.env.DATABASE_SERVER,
  database: process.env.DATABASE_INITIAL_DB,
  port: parseInt(process.env.DATABASE_PORT),
  options: { encrypt: false }
}

// Web Server Setup (Express, Cors, Pug etc...)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Body Parser Middleware for Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'text/html' }));
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.urlencoded({ extended: true }));

// CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origins: '*',
  methods: ['GET', 'POST']
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization");
  next();
});

var items = [];
var item = [];

// Path Rules & HTTP Methods
/*
 * [GET] - /
 *
 * Page shows list of records from the database
*/
app.get("/", function (req, res) {
  const query = "SELECT * FROM Studentinfo";
  sql.connect(dbConfig, function(err) {
    if (err) console.log(err);
    const request = new sql.Request();
    request.query(query, function (err, recordset) {
      if (err) console.log(err);
      for (let [key, value] of Object.entries(recordset)) {
        if (key === "recordset") {
          items = [];
          for (var i = 0; i < value.length; i++) {
            item = {
              id: value[i].ID,
              name: value[i].Name,
              age: value[i].Age
            };
            items.push(item);
          }
        }
      }
      //console.log(util.inspect(items, false, null, true))
      res.render('index', { title:'items', items: items});
      res.end;
    });
  });
});

/*
 * [POST] - /user
 *
 * Input: String with formatting
 * 
 * Retrieve data about a given user
*/
app.post("/user", function(req, res) {
  sql.connect(dbConfig, function (err) {
    if (err) console.log(err);
    const request = new sql.Request()

    request.input('StudentID', req.body["dropDown"][0]); // Use MSSQL method for adding variables to sanitise/prevent SQL Injection
    request.query("SELECT * FROM Studentinfo WHERE ID = @StudentID", function (err, recordset) {
      if (err) console.log(err);
      for (let [key, value] of Object.entries(recordset)) {
        if (key === "recordset") {
          items = [];
          for (var i = 0; i < value.length; i++) {
            item = {
              id: value[i].ID,
              name: value[i].Name,
              age: value[i].Age
            };
            items.push(item);
          }
        }
      }
      res.render('table', {title: 'items', items: items});
      res.end;
    });
  });
});

/*
 * [PUT] - /user
 *
 * Input (Optional): Either name, age or both
 * 
 * Update data about a given user
*/

app.post("/user/:id", function(req, res) {
  var errors = [];
  // Check to see if required variables are set
  if (req.body.name === undefined) {
    errors.push("[!] Name variable not valid!");
  }

  if (req.body.age === undefined) {
    errors.push("[!] Age entered not valid!")
  }

  sql.connect(dbConfig, function (err) {
    if (err) console.log(err);
    const request = new sql.Request()

    request.input('StudentID', req.params.id); // Use MSSQL method for adding variables to sanitise/prevent SQL Injection
    request.query("SELECT * FROM Studentinfo WHERE ID = @StudentID", function (err, recordset) {
      if (err) console.log(err);
      for (let [key, value] of Object.entries(recordset)) {
        if (key === "recordset") {
          items = [];
          for (var i = 0; i < value.length; i++) {
            item = {
              id: value[i].ID,
              name: value[i].Name,
              age: value[i].Age
            };
            items.push(item);
          }
        }
      }

      if (items.length != 1) {
        errors.push("ID returned no results")
      }

      if (errors.length > 0) {
        //res.render('index', { title:'items', items: items, errors: errors});
      }

      // Perform update
      //res.status(400).send('<h1>400! Something went wrong...</h1>'); 
      //res.end;
    });

    request.input("StudentName", req.body.name);
    request.input("StudentAge", parseInt(req.body.age));
    console.log(`Values: ${req.body.name}, ${parseInt(req.body.age)}`)
    request.query("UPDATE Studentinfo SET name = @StudentName, age = @StudentAge WHERE ID = @StudentID", function (err, recordset) {
      if (err) {
        console.log(err);
      }
  });
  });

  res.redirect("/");
});

// Initialise main application loop 
// (Listening and responding to HTTP networking requests)
app.listen(APP_PORT, function() {
  console.log(`[-] INFO :: Application started at: http://${APP_HOST}/${APP_PORT}`);
})