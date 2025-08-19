// middlewares/authentication.js
import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import { getLatestTokenIdByUserId } from "../services/tokenService.js";
import ApiError from "../utils/apiError.js";


export const userAuth = (role = null) => async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    // If the token is not provided, respond with a 403 status.
    if (!token) {
      return res.status(403).json({ error: "Token not provided" });
    }

    // Verify the token using the secret key.

    const decodedToken = jwt.verify(token, config.development.jwtSecret);

    const latestTokenId = await getLatestTokenIdByUserId(
      req.db,
      decodedToken.userId
    );


    if (!latestTokenId || latestTokenId !== decodedToken.jti) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if(role) {
      if(decodedToken.userType.toLowerCase() !== role.toLowerCase())
        return res.status(401).json({ error: "Unauthorized" });

      if(decodedToken.userId !== req.params.sellerId)
        return res.status(401).json({ error: "Unauthorized" });
    } 

    req.userId = decodedToken.userId;
    req.tokenId = decodedToken.jti;

    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized");
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    // Retrieve the token from the request headers.
    const token = req.headers["authorization"];

    // If the token is not provided, respond with a 403 status.
    if (!token) {
      return res.status(403).json({ error: "Token not provided" });
    }

    // Verify the token using the secret key.

    const decodedToken = jwt.verify(token, config.development.jwtSecret);

    const latestTokenId = await getLatestTokenIdByUserId(
      req.db,
      decodedToken.userId
    );


    if (!latestTokenId || latestTokenId !== decodedToken.jti) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    }

    next();

  } catch (error) {
        return res.status(401).json({ error: 'Failed to authenticate token' });
  }
};
