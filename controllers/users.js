const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => new Error('NotValid'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValid') {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      } if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        next(err);
      }
    });
}; //

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    if (!name && !about) {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    const user = await User.findByIdAndUpdate(userId, { name, about }, { new: true })
      .orFail(() => new Error('NotValid'));
    res.send(user);
  } catch (err) {
    if (err.message === 'NotValid') {
      res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    } else {
      next(err);
    }
  }
};

const updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  if (!avatar) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
    return;
  }
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .orFail(() => new Error('NotValid'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValid') {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar,
};
