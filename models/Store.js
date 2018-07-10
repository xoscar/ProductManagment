// dependencies
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: String,
  image: String,
  store_type: {
    type: String,
    enum: ['electronics', 'groceries', 'videogames', 'cars'],
    default: 'groceries',
  },

  created_at: Date,
  updated_at: Date,
});

module.exports = mongoose.model('stores', storeSchema);
