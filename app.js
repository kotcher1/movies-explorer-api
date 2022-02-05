require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { CURRENT_PORT, CURRENT_DATABASE } = require('./configs/index');
const handleErrors = require('./middlewares/error');
const limiter = require('./middlewares/limiter');
const { SERVER_CRASH } = require('./configs/messages-constants');

const app = express();

const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(requestLogger);

app.use(limiter);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

mongoose.connect(CURRENT_DATABASE, {
  useNewUrlParser: true,
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(SERVER_CRASH);
  }, 0);
});

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(CURRENT_PORT, () => {
});
