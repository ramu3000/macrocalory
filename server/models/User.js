const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  displayName: String,
  local: {
    email: String,
    password: String
  },
  google: {
    id: String,
    email: String,
    name: String
  },
  fitbit: {
    id: String,
    access_token: String,
    refresh_token: String,
    expires_in: Number
  },
  _water: { type: Schema.Types.ObjectId, ref: 'Water', required: true }
});

mongoose.model('users', userSchema);
