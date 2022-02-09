const router = require('express').Router();
const { updateUserValidator } = require('../middlewares/validation');

const {
  getUser,
  updateUserInfo,
} = require('../controllers/users');

router.get('/users/me', getUser);

router.patch('/users/me', updateUserValidator, updateUserInfo);

module.exports = router;
