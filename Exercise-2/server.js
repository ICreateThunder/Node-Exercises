const fs = require('fs');
const cors = require('cors');
const util = require('util');

const PORT = '3000';

const express = require('express');
const app = express();

/*
 *
 *  [Does NOT work] : Further research required
 * 
 * Initial impressions suggests that "app.get()" executes
 * in a different scope to global script, hence "pages" is
 * undefined. This means that when trying to get path rules
 * failure to do so (string is undefined) erroring out.
 * 
*/

// const pages = [
//   {'GET': ['', 'index'],
//     'PAGE': 'index.html'},
//   {'GET': ['about'],
//     'PAGE': 'about.html'},
//   {'GET' : ['contact'],
//     'PAGE': 'contact.html'}
//   ];

// // Iterate over the pages
// for (var i = 0; i < pages.length; i++) {
//   // For each page iterate over each path for GET HTTP Method
//   for (var j = 0; j < pages[i].GET.length; j++) {
//     app.get(`/${pages[i].GET[j]}`, function(req, res) {
//       // Inspect Object >> util.inspect(pages[0], false, null, true /* enable colors */)
//       console.log(pages[i].GET[0]);
//       res.sendFile(`${__dirname}/${pages[i].PAGE}`);
//     });
//   }
// }

app.get('/', function(req, res) {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/index.html', function(req, res) {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/contact.html', function(req, res) {
  res.sendFile(`${__dirname}/contact.html`);
});

app.get('/about.html', function(req, res) {
  res.sendFile(`${__dirname}/about.html`);
});


var server = app.listen(PORT, function() {
  console.log("Application listening on port %s", PORT)
})