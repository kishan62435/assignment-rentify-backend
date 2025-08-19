// helpers/jwtHelper.js
import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import { v4 as uuidv4 } from "uuid";
import ms from 'ms';

export const generateToken = (payload) => {
  const jwtId = uuidv4();

  payload.jti = jwtId;
  return {
    token: jwt.sign(payload, config.development.jwtSecret, {
      expiresIn: config.development.jwtExpiresIn,
    }),
    jwtId,
    exp: new Date(Date.now() + ms(config.development.jwtExpiresIn)),
  };
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.development.jwtSecret);
};
