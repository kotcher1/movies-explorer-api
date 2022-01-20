const Movies = require('../models/movies');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const { DATA_NOT_VALID_TO_CREATE_MOVIE, MOVIE_ID_NOT_FOUND, NO_RIGHT_TO_DELETE_MOVIE } = require('../configs/messages-constants');

module.exports.getMovie = (req, res, next) => {
  Movies.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(DATA_NOT_VALID_TO_CREATE_MOVIE));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movies.findById(movieId)
    .orFail(() => {
      throw new NotFoundError(MOVIE_ID_NOT_FOUND);
    })
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        return movie.remove()
          .then(() => res.send({ data: movie }))
          .catch((err) => next(err));
      }
      throw new ForbiddenError(NO_RIGHT_TO_DELETE_MOVIE);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(MOVIE_ID_NOT_FOUND));
      }
      return next(err);
    });
};
