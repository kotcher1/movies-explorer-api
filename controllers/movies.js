const Movies = require('../models/movies');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

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
        return next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movies.findById(movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм с указанным _id не найден.');
    })
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        card.remove()
          .then(() => res.send({ data: card }));
        return;
      }
      throw new ForbiddenError('Нельзя удалить фильм другого пользователя.');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан несуществующий id фильма.'));
      }
      return next(err);
    });
};
