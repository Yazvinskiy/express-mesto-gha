const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

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

    const card = await Card.create({ name, link, owner: req.user._id });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidatorError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);

    if (card.owner == req.user._id) {
      Card.findByIdAndDelete(card)
        .then(res.send(card));
    } else {
      throw new NotFoundError('Карточка с указанным id не найден');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
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
      throw new NotFoundError('Карточка с указанным id не найден');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
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
      throw new NotFoundError('Карточка с указанным id не найден');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
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
