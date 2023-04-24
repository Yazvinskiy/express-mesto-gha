const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const app = express();
const PORT = 3000;
const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connecting mongo');
}).catch((err) => {
  console.log(`Error ${err}`);
});

app.use(express.json());

app.use('/', router);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Listing on port ${PORT}`);
});
