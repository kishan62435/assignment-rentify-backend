// config.js
import dotenv from 'dotenv';
dotenv.config();


/**
 * Configuration object for the application. It contains different environments,
 * each with its own mongoURI, jwtSecret, and jwtExpiresIn.
 *
 * - development: Used for local development, with a short token expiration time.
 * - production: Used for production environments, with a longer token expiration time.
 */
const config = {
  development: {
    mongoURI: process.env.MONGO_URI_DEV,
    jwtSecret: process.env.JWT_SECRET_DEV,
    jwtExpiresIn: '1h' // Token expiration time for development environment
  },
  production: {
    mongoURI: process.env.MONGO_URI_PROD,
    jwtSecret: process.env.JWT_SECRET_PROD,
    jwtExpiresIn: '1d' // Token expiration time for production environment
  },
};

export default config;