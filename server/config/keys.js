// keys.js - figure out what set of credentials to return
// Heroku sets this env-variable
if (process.env.NODE_ENV === 'production') {
  // Return the prod set of keys
  module.exports = require('./prod');
} else {
  // Return the dev keys
  module.exports = require('./dev');
}
