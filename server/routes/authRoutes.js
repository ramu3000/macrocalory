const passport = require('passport');

module.exports = app => {
  /**
   * AUTH
   *
   */

  /* GOOGLE */
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/');
    }
  );

  /* FITBIT */

  app.get(
    '/auth/fitbit',
    passport.authenticate('fitbit', {
      scope: ['activity', 'profile', 'nutrition', 'heartrate']
    })
  );

  app.get(
    '/auth/fitbit/callback',
    passport.authenticate('fitbit', {
      successRedirect: '/auth/fitbit/success',
      failureRedirect: '/auth/fitbit/failure'
    })
  );

  app.get('/auth/fitbit/success', (req, res) => {
    res.json('sucess');
  });

  app.get('/auth/fitbit/failure', (req, res) => {
    res.json('failure');
  });
  /**
   * AUTHORIZE (LOGGED IN ALREADY)
   *
   */
  /* GOOGLE */
  app.get(
    '/connect/google',
    passport.authorize('google', {
      scope: ['profile', 'email']
    })
  );
  app.get(
    '/connect/google/callback',
    passport.authorize('google'),
    (req, res) => {
      res.redirect('/');
    }
  );

  /* FITBIT */

  app.get(
    '/connect/fitbit',
    passport.authorize('fitbit', {
      scope: ['activity', 'profile', 'nutrition', 'heartrate']
    })
  );

  app.get(
    '/connect/fitbit/callback',
    passport.authorize('fitbit', {
      successRedirect: '/connect/fitbit/success',
      failureRedirect: '/connect/fitbit/failure'
    })
  );

  app.get('/connect/fitbit/success', (req, res) => {
    res.json('sucess');
  });

  app.get('/connect/fitbit/failure', (req, res) => {
    res.json('failure');
  });

  /**
   * OTHER
   */
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect('/');
}