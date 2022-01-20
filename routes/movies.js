const router = require('express').Router();
const { addMovieValidator, deleteMovieValidator } = require('../middlewares/validation');

const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovie);

router.post('/movies', addMovieValidator, createMovie);

router.delete('/movies/:movieId', deleteMovieValidator, deleteMovie);

module.exports = router;
