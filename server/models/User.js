const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  email: String,
  name: String,
  fitbit: {
    id: String,
    access_token: String,
    refresh_token: String
  },
  _water: { type: Schema.Types.ObjectId, ref: 'Water', required: true }
});

mongoose.model('users', userSchema);
