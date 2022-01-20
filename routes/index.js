const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');
const { PAGE_NOT_FOUND } = require('../configs/messages-constants');
const { signinValidator, signupValidator } = require('../middlewares/validation');

router.post('/signin', signinValidator, login);

router.post('/signup', signupValidator, createUser);

router.use('/', auth);

router.use('/users', auth, require('./users'));

router.use('/movies', auth, require('./movies'));

router.use(() => {
  throw new NotFoundError(PAGE_NOT_FOUND);
});

module.exports = router;
