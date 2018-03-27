const mongoose = require('mongoose');
const { Schema } = mongoose;
const MealIngredientSchema = require('./MealIngredient');

const mealSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  date: { type: Date, required: true },
  ingredients: { type: [MealIngredientSchema], required: true },
  _user: { type: Schema.Types.ObjectId , ref: 'User', required: true }
});


mongoose.model('meals', mealSchema);