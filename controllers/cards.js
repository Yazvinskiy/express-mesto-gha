const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;
  if (!name || !link) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
    return;
  }
  Card.create({ name, link, owner: userId })
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((card) => res.send(card))
    .catch((err) => res.status(404).send({ message: 'Карточка с указанным _id не найдена' }));
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
      res.status(200).send(card);
    } else {
      res.status(404).send({ message: 'Карточка с указанным id не найдена' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректный id' });
      return;
    }
    next(err);
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
      res.status(200).send(card);
    } else {
      res.status(404).send({ message: 'Карточка с указанным id не найдена' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректный id' });
      return;
    }
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
