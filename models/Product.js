// dependencies
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  category: String,
  count: Number,

  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'stores',
  },

  created_at: Date,
  updated_at: Date,
});

module.exports = mongoose.model('products', productSchema);
