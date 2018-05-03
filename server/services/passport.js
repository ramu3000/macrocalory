const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }
      const newWaterId = new mongoose.mongo.ObjectID();
      const user = await new User({
        googleId: profile.id,
        name: profile.name.givenName,
        _water: newWaterId
      }).save();
      await new Water({
        _id: newWaterId,
        _user: user._id,
        defaultTarget: WATER_TARGET_INITIAL_VALUE,
        dailyWaters: []
      }).save();
      done(null, user);
    }
  )
);
