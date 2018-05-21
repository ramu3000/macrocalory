const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const _ = require('lodash');
const axios = require('axios');
const querystring = require('querystring');


const User = mongoose.model('users');
const Meal = mongoose.model('meals');



module.exports = app => {
  app.get('/api/sync/:mealId', requireLogin, async (req, res) => {
    const id = req.params.mealId;
    try {
      const meal = await Meal.findOne({ _id: id, _user: req.user.id }).select(
        '-__v -_user'
      );
      if(!meal) {
        res.status(404).json({
          message: 'Meal with given id does not exist',
          id: id
        });
      }
      const { ingredients } = meal;
      const ing = ingredients[0];
     
      const obj = {
        name: ing.name,
        calories: ing.calories,
        carbs: ing.carbohydrate,
        defaultFoodMeasurementUnitId: '147',
        defaultServingSize: '100',
        nutritionalValues: { protein: ing.protein }
      };


      const { fitbit } = await User.findOne({_id: req.user.id});

      try {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + fitbit.access_token;
        const data = await axios.post('https://api.fitbit.com/1/user/-/foods.json',querystring.stringify(obj) );
        console.log(data);
        res.status(200).json(data.data);
      } catch(err) {
        console.log('error', err);
      }

    } catch (err){
      res.status(700).json(err)
    }
   

    
  });

};
