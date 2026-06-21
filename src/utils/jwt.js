const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const jwt = require("jsonwebtoken");
const logger = require("./logger");
const { IS_DEV } = require("./constants");
const { HttpInternalServerError, HttpUnauthorized, isHttpError } = require("./http-errors");

const ACCESS_TOKEN_SECRET_PATH = process.env.AUTH_ACCESS_TOKEN_SECRET_PATH;
const REFRESH_TOKEN_SECRET_PATH = process.env.AUTH_REFRESH_TOKEN_SECRET_PATH;

const getAccessSecret = async () => {
  try {
    const secret = await fsp.readFile(path.resolve(ACCESS_TOKEN_SECRET_PATH), "utf-8");
    return secret.trim();
  } catch (err) {
    logger.error(`failed to get secret : ${err.message}`);
    /* istanbul ignore next */
    if (IS_DEV) {
      logger.error(err.stack || `${err.name}: ${err.message}`);
    }
    throw new HttpInternalServerError("failed to get secret");
  }
};

const getRefreshSecret = async () => {
  try {
    const secret = await fsp.readFile(path.resolve(REFRESH_TOKEN_SECRET_PATH), "utf-8");
    return secret.trim();
  } catch (err) {
    logger.error(`failed to get refresh secret : ${err.message}`);
    /* istanbul ignore next */
    if (IS_DEV) {
      logger.error(err.stack || `${err.name}: ${err.message}`);
    }
    throw new HttpInternalServerError("failed to get refresh secret");
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
    const accessSecret = await getAccessSecret();
    const refreshSecret = await getRefreshSecret();
    const accessToken = jwt.sign(payload, accessSecret, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: "1d",
    });
    return { accessToken, refreshToken };
  } catch (err) {
    logger.error(`failed generate token : ${err.message}`);
    /* istanbul ignore next */
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
 * verify token
 * @param {string} token
 * @param {string} secret
 * @returns {DecodedTokenPayload}
 */
const verifyToken = async (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    logger.error(`failed verify token : ${err.message}`);
    /* istanbul ignore next */
    if (IS_DEV) {
      logger.error(err.stack || `${err.name}: ${err.message}`);
    }
    /* istanbul ignore if */
    if (isHttpError(err)) {
      throw err;
    } else if (err.name === "TokenExpiredError") {
      throw new HttpUnauthorized("token-expired");
    } else if (err.name === "JsonWebTokenError") {
      throw new HttpUnauthorized("token-invalid");
    }
    /* istanbul ignore next */
    throw new HttpInternalServerError("failed verify access token");
  }
};

/**
 * verify access token
 * @param {string} token
 * @returns {DecodedTokenPayload}
 */
const verifyAccessToken = async (token) => {
  const secret = await getAccessSecret();
  return await verifyToken(token, secret);
};

/**
 * verify refresh token
 * @param {string} token
 * @returns {DecodedTokenPayload}
 */
const verifyRefreshToken = async (token) => {
  const secret = await getRefreshSecret();
  return await verifyToken(token, secret);
};

module.exports = { generateToken, verifyAccessToken, verifyRefreshToken };
