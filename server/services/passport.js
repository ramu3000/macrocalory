const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');
const Water = mongoose.model('waters');

const WATER_TARGET_INITIAL_VALUE = 0;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});
// =========================================================================
// GOOGLE ================================================================
// =======================================================================
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      passReqToCallback: true,
      proxy: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      if (!req.user) {
        try {
          const existingUser = await User.findOne({ 'google.id': profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }

          const newWaterId = new mongoose.mongo.ObjectID();
          const user = await new User({
            displayName: profile.name.givenName,
            'google.id': profile.id,
            'google.name': profile.name.givenName,
            'google.email': profile.emails[0].value,
            _water: newWaterId
          }).save();

          await new Water({
            _id: newWaterId,
            _user: user._id,
            defaultTarget: WATER_TARGET_INITIAL_VALUE,
            dailyWaters: []
          }).save();

          done(null, user);
        } catch (err) {
          console.log(err);
          return done(err);
        }
      } else {
        var user = req.user;
        user.google.id = profile.id;
        user.google.name = profile.name.givenName;
        user.google.email = profile.emails[0].value;
        user.save(function(err) {
          if (err) throw err;
          return done(null, user);
        });
      }
    }
  )
);
// =========================================================================
// FITBIT ================================================================
// =======================================================================
passport.use(
  new FitbitStrategy(
    {
      clientID: keys.FITBIT_CLIENT_ID,
      clientSecret: keys.FITBIT_CLIENT_SECRET,
      callbackURL: '/auth/fitbit/callback',
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      if (!req.user) {
        const existingUser = await User.findOne({ 'fitbit.id': profile.id });
        if (existingUser) {
          existingUser.fitbit.access_token = accessToken;
          existingUser.fitbit.refresh_token = refreshToken;
          existingUser.save();
          return done(null, existingUser);
        }
        const newWaterId = new mongoose.mongo.ObjectID();
        const user = await new User({
          displayName: profile.name,
          fitbit: {
            id: profile.id,
            access_token: accessToken,
            refresh_token: refreshToken
          },
          name: profile.displayName,
          _water: newWaterId
        }).save();
        await new Water({
          _id: newWaterId,
          _user: user._id,
          defaultTarget: WATER_TARGET_INITIAL_VALUE,
          dailyWaters: []
        }).save();
        done(null, user);
      } else {
        var user = req.user;
        user.fitbit.id = profile.id;
        user.fitbit.access_token = accessToken;
        user.fitbit.refresh_token = refreshToken;
        user.save(function(err) {
          if (err) throw err;
          return done(null, user);
        });
      }
    }
  )
);
