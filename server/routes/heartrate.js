const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const _ = require('lodash');
const axios = require('axios');
const querystring = require('querystring');

const User = mongoose.model('users');
const keys = require('../config/keys');

module.exports = app => {
  app.get('/api/heartrate', requireLogin, async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.id });
      const { fitbit } = user;

      
      const status = await getHeartRate(fitbit);
      console.log('status', status);
      if (status === 401) {
        refreshToken(user);
      }
    } catch (err) {
      console.log(err);
      res.status(403).json(err);
    }
  });
};

async function getHeartRate(fitbit) {
  axios.defaults.headers.common['Authorization'] =
    'Bearer ' + fitbit.access_token;
  try {
    const data = await axios.get(
      `https://api.fitbit.com/1/user/${
        fitbit.id
      }/activities/heart/date/today/1d.json`
    );
    console.log(data.data);
    return data.data;
  } catch (error) {
    //console.log('MYFUCKING OBJECT', error.response);

    if (error.response.status === 401) {
      console.log('needs to refresh');
      return error.response.status;
      //res.status(401).send(error.response.data.errors[0].message);
    } else {
      console.log('lol');
      res.status(500).json(error.response.data);
    }
  }
}

async function refreshToken(user) {
  console.log(user);
  const {
    fitbit: { refresh_token }
  } = user;

  const userData = {
    grant_type: 'refresh_token',
    refresh_token: refresh_token
  };

  try {
    const secret = keys.FITBIT_CLIENT_ID + ':' + keys.FITBIT_CLIENT_SECRET;
    let buff = new Buffer(secret);
    let base64data = buff.toString('base64');

    const data = await axios.post(
      'https://api.fitbit.com/oauth2/token',
      querystring.stringify(userData),
      {
        headers: {
          Authorization: 'Basic ' + base64data
        }
      }
    );
    console.log('newtoken', newTokenData);
    return;
    return updateToken(data, user);
  } catch (err) {
    console.log('error_token_update', err.response.data);
  }
}

async function updateToken(newTokenData, user) {
  console.log('newtoken', newTokenData);
  try {
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id
      },
      {
        fitbit: {
          //refresh_token: newTokenData
          expires_in: 2
        }
      }
    );
    console.log('user_success', updatedUser);
  } catch (err) {
    console.log('db_user_update', err);
  }
}
