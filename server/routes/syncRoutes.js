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
      if (!meal) {
        res.status(404).json({
          message: 'Meal with given id does not exist',
          id: id
        });
        return;
      }
      const { ingredients } = meal;
      const { fitbit } = await User.findOne({ _id: req.user.id });
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + fitbit.access_token;

      //TODO: check if foods has fitbit id already, then skip
      const foodPromises = saveFoodsToFitbit(ingredients);

      const results = await Promise.all(foodPromises);

      const fitbitFoodIds = [];
      let statusFailed = false;

      _.each(results, result => {
        if (result.status === 201) {
          fitbitFoodIds.push(result.data.food.foodId);
        } else {
          statusFailed = true;
        }
      });
      console.log(fitbitFoodIds);

      //TODO send
      const foods = _.map(ingredients, (ingredient, index) => {
        return {
          foodId: fitbitFoodIds[index],
          amount: ingredient.mass
        };
      });

      const loggedFoodsPromise = logFoodsToFitbit(foods, '2018-05-24');
      const foodResults = await Promise.all(loggedFoodsPromise);

      console.log(foodResults);

      if (!statusFailed) {
        res.status(201).json(results[0].data);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err.response.data);
    }
  });
};

function saveFoodsToFitbit(foods) {
  const promises = [];
  _.each(foods, ingredient => {
    const obj = {
      name: ingredient.name,
      defaultFoodMeasurementUnitId: '147',
      defaultServingSize: '100',
      calories: ingredient.kcal.toFixed(),
      protein: ingredient.protein,
      totalCarbohydrate: ingredient.carbohydrate,
      totalFat: ingredient.fat
    };
    promises.push(
      axios.post(
        'https://api.fitbit.com/1/user/-/foods.json',
        querystring.stringify(obj)
      )
    );
  });

  return promises;
}

function logFoodsToFitbit(foods, date) {
  const mealTypeId = fitbitMealTypeId(12);

  const promises = [];
  _.each(foods, ingredient => {
    const food = {
      foodId: ingredient.foodId,
      mealTypeId,
      unitId: '147',
      amount: ingredient.amount,
      date
    };
    promises.push(
      axios.post(
        'https://api.fitbit.com/1/user/-/foods/log.json',
        querystring.stringify(food)
      )
    );
  });

  return promises;
}

async function saveMealToFitbit(meal, foods, response) {
  const mealData = {
    name: meal.name,
    description: 'created with macromeals',
    mealFoods: foods
  };
  try {
    return await axios.post(
      'https://api.fitbit.com/1/user/-/meals.json',
      mealData
    );
  } catch (err) {
    console.log(err.response.status);
    response.status(500).json({ err: err.response.data });
  }
}

function fitbitMealTypeId(time) {
  //'HH'
  if (time > 3 && time < 11) {
    return 1;
  } else if (time >= 11 && time < 15) {
    return 3;
  } else if (time >= 15 && time < 24) {
    return 5;
  } else {
    return 7;
  }
}
