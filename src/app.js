/* express kóði hér */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const router = express.Router();
const user = require('./user.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname));
app.set('view engine', 'pug');
// breyta þarf hér fyrir    user   password                    database
const dataSetting = 'postgres://postgres:Arsenal1@localhost:5432/santaintrouble';
const db = pgp(dataSetting);
app.use(session({
  store: new pgSession({
    conString: dataSetting
  }),
  secret: 'jkhefhjNHmhgemjh7623ghw872jhgjHu72gh',
  resave: false,
  saveUninitialized: true
}));

app.get('/', isLoggedIn, (req, res) => {
  res.render('index', { title: 'SantaInTroubles' , loggedIn: false});
});

app.get('/loggedIn', (req, res) => {
  res.render('index', { title: 'SantaInTroubles', loggedIn: true});
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/newUser', (req, res) => {
  const username = req.body.userFieldInput;
  const password = user.checkValidPassword(req.body.passFieldInput);
  if(password === "") {
    res.render('signup', {passError: 'password length has to be more than 5.'});
  }
  else {
    db.any('insert into "user" (username, password) values ($1, $2)', [username, password])
    .then((data) => {
      res.redirect('/');
    })
    .catch((error) => {
      res.render('signup', {userError: username + ' username already exists!'});
    });
  }
});

app.post('/login', (req, res) => {
  const username = req.body.userFieldInput;
  const password = user.checkValidPassword(req.body.passFieldInput);
  db.any('select * from "user" where "user".username=$1 and "user".password=$2', [username, password])
    .then((data) => {
      if(data[0]) {
        req.session.username = username;
      }
      res.redirect('/');
    })
    .catch((error) => {
      console.log(('error', error));
    });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/loginCheck', (req, res) => {
  if(req.session.username){
    res.send(true);
  }else{
    res.send(false);
  }
});

app.get('/loadGame', (req, res) => {
  let username = req.session.username;
  db.any('SELECT savegame FROM "user" where username = ($1)',[username])
    .then((data) => {
      res.send(data)
    })

});

app.post('/saveGame', (req, res) => {
  let saveGame = req.body.saveData;
  let username = req.session.username;
  db.any('UPDATE "user" SET savegame = ($1) where username = ($2)',[saveGame,username]);
  res.send("saved")
})

function isLoggedIn(req, res, next) {
  if(req.session.username) {
    res.redirect('/loggedIn');
  } else {
    next();
  }
};

app.get('/sql', (req, res, next) => {
  db.any('select * from "user"')
    .then((data) => {
      for(var prop in data) {
        if(data.hasOwnProperty(prop)) {
          console.log(data);
          console.log('data: ' + data[prop]);
        }
      }
      res.render('data', { title: 'Data', data });
    })
    .catch((error) => {
      console.log('error', error);
      res.render('error', {title: 'Error', error});
    });
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
