/* eslint no-param-reassign: ["error", { "props": false }] */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const user = require('./user.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname));
app.set('view engine', 'pug');
// breyta þarf hér fyrir    user   password                    database

const env = process.env.DATABASE_URL;
const dataSetting = 'postgres://postgres:Arsenal1@localhost:5432/santaintrouble';
const db = pgp(env || dataSetting);
app.use(session({
  store: new PgSession({
    conString: env || dataSetting,
  }),
  secret: 'jkhefhjNHmhgemjh7623ghw872jhgjHu72gh',
  resave: false,
  saveUninitialized: true,
}));

function isLoggedIn(req, res, next) {
  if (req.session.username) {
    res.redirect('/loggedIn');
  } else {
    next();
  }
}

function getDailyRanking(req, res, next) {
  const today = new Date();
  const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
  db.any('SELECT * FROM round WHERE date > $1 ORDER BY score DESC LIMIT 100', yesterday)
  .then((data) => {
    req.dailyRanking = data;
    next();
  });
}

function getWeeklyRanking(req, res, next) {
  const today = new Date();
  const previousweek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
  db.any('SELECT * FROM round WHERE date > $1 ORDER BY score DESC LIMIT 100', [previousweek])
  .then((data) => {
    req.weeklyRanking = data;
    next();
  });
}

app.get('/', isLoggedIn, getDailyRanking, getWeeklyRanking, (req, res) => {
  res.render('index', {
    title: 'SantaInTroubles',
    loggedIn: false,
    dailyRanking: req.dailyRanking,
    weeklyRanking: req.weeklyRanking,
  });
});

app.get('/loggedIn', getDailyRanking, getWeeklyRanking, (req, res) => {
  db.any('SELECT savegame FROM "user" WHERE username=$1', [req.session.username])
    .then((data) => {
      const response = data[0].savegame;
      res.render('index', {
        title: 'SantaInTroubles',
        loggedIn: true,
        username: req.session.username,
        savegame: response,
        dailyRanking: req.dailyRanking,
        weeklyRanking: req.weeklyRanking,
      });
    });
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/newUser', (req, res) => {
  const username = req.body.userFieldInput;
  const password = user.checkValidPassword(req.body.passFieldInput);
  if (password === '') {
    res.render('signup', {
      passError: 'password length has to be more than 5.',
    });
  } else {
    db.any('insert into "user" (username, password) values ($1, $2)', [username, password])
    .then((data) => {
      res.redirect('/');
    })
    .catch((error) => {
      const errMessage = `${username} username already exists!`;
      res.render('signup', {
        userError: errMessage,
      });
    });
  }
});

app.post('/login', (req, res) => {
  const username = req.body.userFieldInput;
  const password = user.checkValidPassword(req.body.passFieldInput);
  db.any('select * from "user" where "user".username=$1 and "user".password=$2',
    [username, password])
    .then((data) => {
      if (data[0]) {
        req.session.username = username;
      }
      res.redirect('/');
    });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/loginCheck', (req, res) => {
  if (req.session.username) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get('/loadGame', (req, res) => {
  const username = req.session.username;
  db.any('SELECT savegame FROM "user" where username = ($1)', [username])
    .then((data) => {
      res.send(data);
    });
});

app.post('/saveGame', (req, res) => {
  const saveGame = req.body.saveData;
  const username = req.session.username;
  db.any('UPDATE "user" SET savegame = ($1) where username = ($2)', [saveGame, username]);
  res.send('saved');
});

app.post('/saveRound', (req, res) => {
  const runData = req.body;
  const username = req.session.username;
  const date = new Date();
  db.any('INSERT into "round" VALUES($1, $2, $3, $4, $5, $6)',
  [username, date, runData.gifts, runData.kills, runData.distance, runData.score])
  .then((data) => {
    res.send('saved');
  })
  .catch((error) => {
    res.send('not saved');
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    /* jshint unused: false */

    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  /* jshint unused: false */

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: { },
  });
});

module.exports = app;
