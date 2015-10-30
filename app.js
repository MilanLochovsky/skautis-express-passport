var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressSession = require('express-session');

var SkautISStrategy = require('./../passport-skautis/lib').Strategy;
var skautisApplicationId = "44c67992-0d03-4755-8622-26756a84653e";
var SkautIS = require('./../node-skautis/lib');
var skautis = new SkautIS(skautisApplicationId, true);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


// SkautIS passport use

passport.use(new SkautISStrategy({
    applicationId: skautisApplicationId,
    useTestSkautIS: true
  },
  function(skautis, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

// helper function

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.get('/', function(req, res, next) {

  var title = "Nepřihlášen";

  if (req.isAuthenticated()) {
    title = "Přihlášen";
  }

  if(req.isAuthenticated()) {
    var items = [];
    console.dir(req.user);
    skautis.setToken(req.user.token);
    skautis.UserManagement.UserDetail(req.user.token, null, function(err, data) {
      if(!err) {
        for(var key in data) {
          items.push(key + ": " + data[key]);
        }
      }
      res.render('index', { title: title, items: items });
    });
  }
  else {
    res.render('index', { title: title, items: [] });
  }
});

app.get('/login', passport.authenticate('skautis'));

app.get('/safe', isLoggedIn, function(req, res) {
  res.render('index', { title: "Safe", items: []});
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.post('/token',passport.authenticate('skautis'), function(req, res, next) {
  res.redirect('/');
});

// 404

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/

module.exports = app;
