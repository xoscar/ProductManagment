// dependencies
const mongoose = require('mongoose');

const sellSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }],
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'stores',
  },
  costumer_id: String,

  created_at: Date,
  updated_at: Date,
});

module.exports = mongoose.model('sells', sellSchema);
