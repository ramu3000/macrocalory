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

      let heartRateData = await getHeartRate(fitbit);
      console.log('status', heartRateData);
      if (heartRateData.status === 401) {
        const newToken = await refreshToken(user);
        const updatedUser = await saveTokenToDatabase(newToken.data, user);
        heartRateData = await getHeartRate(fitbit);
      }
      res.status(200).json(heartRateData.data);
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
    console.log('sucess loading heart rate data', data.data);
    return data.response;
  } catch (error) {
    //console.log('MYFUCKING OBJECT', error.response);

    if (error.response.status === 401) {
      console.log('needs to refresh');
      return error.response;
    } else {
      console.log('other error',error.response.data);
      res.status(500).json(error.response.data);
    }
  }
}

async function refreshToken(user) {
  console.log('user', user);
  const {
    fitbit: { refresh_token }
  } = user;

  const userData = {
    grant_type: 'refresh_token',
    refresh_token: refresh_token,
    expires_in: 120
  };

  try {
    const secret = keys.FITBIT_CLIENT_ID + ':' + keys.FITBIT_CLIENT_SECRET;
    let buff = new Buffer(secret);
    let base64data = buff.toString('base64');

    const newTokenData = await axios.post(
      'https://api.fitbit.com/oauth2/token',
      querystring.stringify(userData),
      {
        headers: {
          Authorization: 'Basic ' + base64data
        }
      }
    );
    return newTokenData;
  } catch (err) {
    console.log('error_token_update', err.response.data);
  }
}

async function saveTokenToDatabase(newTokenData, user) {
  console.log('newtoken', newTokenData);
  try {
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id
      },
      {
        fitbit: {
          access_token: newTokenData.access_token,
          refresh_token: newTokenData.refresh_token,
          expires_in: newTokenData.expires_in
        }
      }
    );
    console.log('user_success', updatedUser);
  } catch (err) {
    console.log('db_user_update', err);
  }
}
