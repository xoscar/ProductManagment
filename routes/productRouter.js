const express = require('express');

// models
const Product = require('../models/Product');

// static
const router = express.Router();

router.post('/', (req, res) => (
  Product.create(req.body)

    .then(newProduct => (
      res.status(201).json(newProduct.toJSON())
    ))
));

router.get('/', (req, res) => (
  Product.find()

    .then(products => (
      res.status(200).json(products)
    ))
));

module.exports = router;
