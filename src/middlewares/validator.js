const logger = require("#/utils/logger");

/**
 * @typedef {import('zod').ZodType} ZodType
 */

/** @param {ZodType} schema */
function validateBody(schema) {
  /** @type {APIRequestHandler} */
  return (req, res, next) => {
    const { data, error } = schema.safeParse(req.body);
    if (error) {
      logger.warn(`invalid body :`, error.message);
      res.sendStatus(400);
    } else {
      Object.defineProperty(req, "body", {
        value: data,
        writable: true,
        enumerable: true,
        configurable: true,
      });
      next();
    }
  };
}

/** @param {ZodType} schema */
function validateParams(schema) {
  /** @type {APIRequestHandler} */
  return (req, res, next) => {
    const { data, error } = schema.safeParse(req.params);
    if (error) {
      logger.warn(`invalid params :`, error.message);
      res.sendStatus(400);
    } else {
      Object.defineProperty(req, "params", {
        value: data,
        writable: true,
        enumerable: true,
        configurable: true,
      });
      next();
    }
  };
}

/** @param {ZodType} schema */
function validateQuery(schema) {
  /** @type {APIRequestHandler} */
  return (req, res, next) => {
    const { data, error } = schema.safeParse(req.query);
    if (error) {
      logger.warn(`invalid query :`, error.message);
      res.sendStatus(400);
    } else {
      Object.defineProperty(req, "query", {
        value: data,
        writable: true,
        enumerable: true,
        configurable: true,
      });
      next();
    }
  };
}

module.exports = {
  validateBody,
  validateParams,
  validateQuery,
};
