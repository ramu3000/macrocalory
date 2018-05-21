const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );
  app.get('/auth/fitbit',
    passport.authenticate('fitbit', { 
      scope: ['activity','profile','nutrition', 'heartrate'] }
    )
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/');
    }
  );
  app.get( '/auth/fitbit/callback', 
    passport.authenticate( 'fitbit', { 
      successRedirect: '/auth/fitbit/success',
      failureRedirect: '/auth/fitbit/failure'
    })
  );
  app.get('/auth/fitbit/success',  (req, res)  => {
    res.json('sucess');
  
  });

  app.get('/auth/fitbit/failure',  (req, res)  => {
    res.json('failure');
  });
  
  

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
