const { Joi, celebrate } = require('celebrate');
const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { regexUrl } = require('../utils/regexes');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(regexUrl)),
  }),
}), createUser);

module.exports = router;
