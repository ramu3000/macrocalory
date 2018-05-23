const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const _ = require('lodash');
const axios = require('axios');

const User = mongoose.model('users');

module.exports = app => {


  app.get('/api/heartrate', requireLogin, async (req, res) => {

 
    try {
      const user = await User.findOne({_id: req.user.id });
      const { fitbit } = user;
    
      try {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + fitbit.access_token;
        const data = await axios.get(`https://api.fitbit.com/1/user/${fitbit.id}/activities/heart/date/today/1d.json`);
        console.log(data.data);
        res.status(200).json(data.data);
      } catch(error) {
        console.log('MYFUCKING OBJECT', error.response);
        

        if(error.response.status === 401){
        
          res.status(401).send(error.response.data.errors[0].message);
        }else {
          res.status(500).json(error.response.data)
        }
      }

    } catch (err) {
      console.log(err);
      res.status(403).json(err);
    }
  });
};
