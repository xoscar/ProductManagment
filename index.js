// dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// routes
const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');

// configure mongo to use Promises
mongoose.Promise = Promise;

// connect to the db
mongoose.connect('mongodb://127.0.0.1:27017/products', {
  useNewUrlParser: true,
})

  .then(() => {
    console.log('Connected to MongoDB');

    app.use(bodyParser.json());

    app.use('/products', productRouter);
    app.use('/users', userRouter);

    // start application
    app.listen(5000, () => {
      console.log('ready');
    });
  });
