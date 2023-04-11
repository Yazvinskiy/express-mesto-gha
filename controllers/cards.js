const httpConstants = require('http2').constants;
const Card = require('../models/card');

const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
} = httpConstants;

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({})
      .populate(['owner', 'likes']);
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const userId = req.user._id;
    const card = await Card.create({ name, link, owner: userId }, { runValidators: true });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidatorError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      next(err);
    }
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);
    if (card) {
      res.send(card);
    } else {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найден' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      next(err);
    }
  }
};

const likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    // добавить _id в массив, если его там нет
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (card) {
      res.send(card);
    } else {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      next(err);
    }
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    // убрать _id из массива
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (card) {
      res.send(card);
    } else {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректный id' });
    } else {
      next(err);
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
