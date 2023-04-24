const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(' Необходима авторизация ');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  // верифицируем токен
  try {
    payload = jwt.verify(token, 'MY_SECRET_KEY');
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new UnauthorizedError(' Необходима авторизация ');
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
