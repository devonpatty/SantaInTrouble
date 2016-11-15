/* express kóði hér */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const user = require('./user.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', { title: 'SantaInTroubles' });
});

app.post('/signup', (req, res) => {
  const username = req.body.userFieldInput;
  const password = user.checkValidPassword(req.body.passFieldInput);
  console.log("username : " + username);
  console.log("password : " + password);
  res.render('index', { username, password });
});
/*
app.post('/calculated', (req, res) => {
  const numEntered = req.body.userInput;
  const splitNumber = multiplier.splitIntoNumbers(req.body.userInput);
  const multiply = multiplier.multiply(splitNumber);
  const factorize = multiplier.factorize(multiply);
  res.render('index', { numEntered, splitNumber, multiply, factorize });
});
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    /* jshint unused: false */

    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  /* jshint unused: false */

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;
