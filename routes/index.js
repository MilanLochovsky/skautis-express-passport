module.exports = function(app, passport) {
  app.get('/', function(req, res, next) {
    var tit = "Neprihlasen";
    if (req.isAuthenticated()) {
      tit = "Prihlasen";
    }
    res.render('index', { title: tit });
  });

  app.get('/login', passport.authenticate('skautis'));

  app.get('/safe', isLoggedIn, function(req, res) {
    res.render('index', { title: "Safe" });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/token',passport.authenticate('skautis'), function(req, res, next) {
    res.redirect('/');
  });

  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
  }
};
