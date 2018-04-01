const mongoose = require('mongoose');
const { Schema } = mongoose;

const mealIngredientSchema = new Schema({
  name: { type: String, required: true },
  mass: { type: Number, required: false },
  kcal: { type: Number, required: false },
  protein: { type: Number, required: false },
  carbohydrate: { type: Number, required: false },
  fat: { type: Number, required: false }
});

module.exports = mealIngredientSchema;
// Don't model to mongoose!