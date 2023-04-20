const { Joi, celebrate } = require('celebrate');
const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { regexEmail, regexUrl } = require('../utils/regexes');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(new RegExp(regexEmail)),
    password: Joi.string().required().min(8),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(new RegExp(regexEmail)),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(regexUrl)),
  }),
}), createUser);

module.exports = router;
