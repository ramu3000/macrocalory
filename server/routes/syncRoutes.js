const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const _ = require('lodash');
const axios = require('axios');
const querystring = require('querystring');
const FitbitApiClient = require('fitbit-node');
const keys = require('../config/keys');

const client = new FitbitApiClient({
  clientId: keys.FITBIT_CLIENT_ID,
  clientSecret: keys.FITBIT_CLIENT_SECRET,
  apiVersion: '1' // 1.2 is the default
});

const User = mongoose.model('users');
const Meal = mongoose.model('meals');

module.exports = app => {
  app.get('/api/sync/:mealId', requireLogin, async (req, res) => {
    const mealId = req.params.mealId;
    const user = await getUser(req.user.id);
    const { fitbit } = user;
    let { access_token } = fitbit;
    const meal = await getMealfromDatabase(mealId, req.user.id);
    const { ingredients } = meal;
    //TODO: check if foods has fitbit id already, then skip
    let promises = await saveFoodsToFitbit(ingredients, access_token);
    let foodResults;

    try {
      foodResults = await Promise.all(promises);
    } catch (error) {
      console.log('error resolving promises:', error);
      res.send(error.response)
    }

    if (foodResults[0][1].statusCode === 401) {
      console.log(401)
      const newToken = await refreshToken(
        access_token,
        fitbit.refresh_token,
        res
      );
      console.log('newToken', newToken)
      saveToken(user, newToken);
      access_token = newToken.access_token
      promises = await saveFoodsToFitbit(ingredients, access_token);
    }

    const fitbitFoodIds = [];
    let statusFailed = false;

    _.each(foodResults, result => {
      if (result.status === 201) {
        fitbitFoodIds.push(result.data.food.foodId);
      } else {
        statusFailed = true;
      }
    });

    //TODO send
    const foods = _.map(ingredients, (ingredient, index) => {
      return {
        foodId: fitbitFoodIds[index],
        amount: ingredient.mass
      };
    });

    const loggedFoodsPromise = logFoodsToFitbit(foods, '2018-06-08', access_token);
    const mealResult = await Promise.all(loggedFoodsPromise);

    console.log('mealresult', mealResult);
    res.json({ meal: mealResult });

    //console.log(foodResults);

    if (!statusFailed) {
      res.status(201).json(mealResult[0].data);
    }
  });
};

async function refreshToken(accessToken, refreshToken, res) {
  let newToken;
  try {
    newToken = await client.refreshAccessToken(accessToken, refreshToken);
  } catch (err) {
    console.log('refrestokenError:', err);
    res.status(401).send(err);
  }
  return newToken;
}

function saveToken(user, token) {
  user.fitbit.access_token = token.access_token;
  user.fitbit.refresh_token = token.refresh_token;
  user.fitbit.expires_at = token.expires_at;
  user.save();
}

async function getMealfromDatabase(mealid, userid) {
  try {
    const meal = await Meal.findOne({ _id: mealid, _user: userid }).select(
      '-__v -_user'
    );
    if (!meal) {
      res.status(404).json({
        message: 'Meal with given id does not exist',
        id: id
      });
      return meal;
    }
    return meal;
  } catch (err) {
    return console.log('no meal in database', err);
    res.status(500).json(err.response.data);
  }
}
async function getUser(userid) {
  try {
    const user = await User.findOne({ _id: userid });
    return user;
  } catch (err) {
    console.log('no user found or error getting user', err);
  }
}
async function saveFoodsToFitbit(foods, accessToken) {
  const promises = [];
  try {
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
        client.post('/foods.json', accessToken, querystring.stringify(obj))
      );
    });
  } catch (error) {
    console.log('fitbit promises error:', error);
  }
  return promises;
}

function logFoodsToFitbit(foods, date, access_token) {
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
      client.post('/foods/log.json', access_token, querystring.stringify(food))
    //  axios.post(
      //  'https://api.fitbit.com/1/user/-/foods/log.json',
       // querystring.stringify(food)
     // )
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
