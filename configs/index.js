require('dotenv').config();

const {
  JWT_SECRET, NODE_ENV, PORT, DATABASE_PATH,
} = process.env;

const CURRENT_JWT = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'some-secret-key';
const CURRENT_PORT = NODE_ENV === 'production' && PORT ? PORT : 3000;
const CURRENT_DATABASE = NODE_ENV === 'production' && DATABASE_PATH ? DATABASE_PATH : 'mongodb://localhost:27017/moviesdb';

module.exports = {
  CURRENT_JWT,
  CURRENT_PORT,
  CURRENT_DATABASE,
};
