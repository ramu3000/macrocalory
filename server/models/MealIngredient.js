const mongoose = require('mongoose');
const { Schema } = mongoose;

const mealIngredientSchema = new Schema({
  title: { type: String, required: true },
  grams: { type: Number, required: true }
});

module.exports = mealIngredientSchema;
// Don't model to mongoose!