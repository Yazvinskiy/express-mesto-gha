const httpConstants = require('http2').constants;
const User = require('../models/user');

const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
} = httpConstants;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (users) {
      res.send(users);
    } else {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователей не найдено' });
    }
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user) {
      res.send(user);
    } else {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: ' Пользователь по указанному id не найден' });
    }
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (user) {
      res.send(user);
    } else {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    } else {
      next(err);
    }
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (user) {
      res.send(user);
    } else {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar,
};
