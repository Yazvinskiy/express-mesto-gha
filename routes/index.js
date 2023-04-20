const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const authRouter = require('./auth');
const authMiddleware = require('../middlewares/auth');

router.use('/', authRouter);
router.use(authMiddleware);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
module.exports = router;
