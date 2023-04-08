const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connecting mongo');
}).catch((err) => {
  console.log(`Error ${err}`);
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '643001515dfef058139d206e',
  };
  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((err, req, res, next) => {
  res.status(500).send('Произошла ошибка');
});

app.listen(PORT, () => {
  console.log(`Listing on port ${PORT}`);
});
