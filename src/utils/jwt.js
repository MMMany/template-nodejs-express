const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const jwt = require("jsonwebtoken");
const logger = require("./logger");
const { IS_DEV } = require("./constants");
const { HttpInternalServerError, HttpUnauthorized, isHttpError } = require("./http-errors");

const ACCESS_TOKEN_SECRET_PATH = process.env.AUTH_ACCESS_TOKEN_SECRET_PATH;

const getSecret = async () => {
  try {
    const secret = await fsp.readFile(path.resolve(ACCESS_TOKEN_SECRET_PATH), "utf-8");
    return secret.trim();
  } catch (err) {
    logger.error(`failed to get secret : ${err.message}`);
    if (IS_DEV) {
      logger.error(err.stack || `${err.name}: ${err.message}`);
    }
    throw new HttpInternalServerError("failed to get secret");
  }
};

/**
 * @typedef {object} AuthTokenPayload
 * @property {string} uid
 * @property {string} userId
 * @property {string[]} perms
 * @property {number} tokenVersion
 */

/**
 * @typedef {import('jsonwebtoken').JwtPayload & AuthTokenPayload} DecodedTokenPayload
 */

/**
 * generate access & refresh token
 * @param {AuthTokenPayload} payload
 */
const generateToken = async (payload) => {
  try {
    const secret = await getSecret();
    const accessToken = jwt.sign(payload, secret, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, secret, {
      expiresIn: "1d",
    });
    return { accessToken, refreshToken };
  } catch (err) {
    logger.error(`failed generate token : ${err.message}`);
    if (IS_DEV) {
      logger.error(err.stack || `${err.name}: ${err.message}`);
    }
    if (isHttpError(err)) {
      throw err;
    }
    throw new HttpInternalServerError("failed generate token");
  }
};

/**
 * verify access token
 * @param {string} token
 * @returns {DecodedTokenPayload}
 */
const verifyAccessToken = async (token) => {
  try {
    const secret = await getSecret();
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    logger.error(`failed verify access token : ${err.message}`);
    if (IS_DEV) {
      logger.error(err.stack || `${err.name}: ${err.message}`);
    }
    if (isHttpError(err)) {
      throw err;
    } else if (err.name === "TokenExpiredError") {
      throw new HttpUnauthorized("token-expired");
    } else if (err.name === "JsonWebTokenError") {
      throw new HttpUnauthorized("token-invalid");
    }
    throw new HttpInternalServerError("failed verify access token");
  }
};

/**
 * verify refresh token
 * @param {string} token
 * @returns {DecodedTokenPayload}
 */
const verifyRefreshToken = async (token) => {
  try {
    const secret = await getSecret();
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    logger.error(`failed verify refresh token : ${err.message}`);
    if (IS_DEV) {
      logger.error(err.stack || `${err.name}: ${err.message}`);
    }
    if (isHttpError(err)) {
      throw err;
    } else if (err.name === "TokenExpiredError") {
      throw new HttpUnauthorized("token-expired");
    } else if (err.name === "JsonWebTokenError") {
      throw new HttpUnauthorized("token-invalid");
    }
    throw new HttpInternalServerError("failed verify refresh token");
  }
};

module.exports = { generateToken, verifyAccessToken, verifyRefreshToken };
