const mongoose = require('mongoose');
const { Schema } = mongoose;
const MealIngredientSchema = require('./MealIngredient');

const mealSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  date: Date,
  ingredients: [MealIngredientSchema],
  _user: { type: Schema.Types.ObjectId , ref: 'User' }
});


mongoose.model('meals', mealSchema);