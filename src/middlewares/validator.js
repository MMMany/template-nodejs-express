const { IS_DEV } = require("#/utils/constants");
const logger = require("#/utils/logger");
const { isPlainObject } = require("lodash");
const z = require("zod");

/* istanbul ignore next */
class ZodSchemaError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = "ZodSchemaError";
  }
}

/**
 * convert plain object as ZodType
 * @param {z.ZodType | object} obj
 */
function asZodType(obj) {
  if (obj instanceof z.ZodType) {
    return obj;
  } else if (isPlainObject(obj)) {
    return z.object(obj);
  } else {
    throw new ZodSchemaError("invalid schema");
  }
}

/**
 * validate `req.body`
 * @param {z.ZodObject | object} schema
 */
function validateBody(schema) {
  /** @type {APIRequestHandler} */
  return (req, res, next) => {
    try {
      const { data, error } = asZodType(schema).safeParse(req.body);
      if (error) {
        logger.warn(`invalid body :`, error.message);
        res.sendStatus(400);
      } else {
        // Object.defineProperty(req, "body", {
        //   value: data,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true,
        // });
        req.valid = { ...req.valid, body: data };
        next();
      }
    } catch (err) {
      logger.error(`failed parsing request body : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }

      /* istanbul ignore else */
      if (err instanceof ZodSchemaError) {
        res.sendStatus(400);
      } else {
        res.sendStatus(500);
      }
    }
  };
}

/**
 * validate `req.params`
 * @param {z.ZodObject | object} schema
 */
function validateParams(schema) {
  /** @type {APIRequestHandler} */
  return (req, res, next) => {
    try {
      const { data, error } = asZodType(schema).safeParse(req.params);
      if (error) {
        logger.warn(`invalid params :`, error.message);
        res.sendStatus(400);
      } else {
        // Object.defineProperty(req, "params", {
        //   value: data,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true,
        // });
        req.valid = { ...req.valid, params: data };
        next();
      }
    } catch (err) {
      logger.error(`failed parsing request params : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }

      /* istanbul ignore else */
      if (err instanceof ZodSchemaError) {
        res.sendStatus(400);
      } else {
        res.sendStatus(500);
      }
    }
  };
}

/**
 * validate `req.query`
 * @param {z.ZodObject | object} schema
 */
function validateQuery(schema) {
  /** @type {APIRequestHandler} */
  return (req, res, next) => {
    try {
      const { data, error } = asZodType(schema).safeParse(req.query);
      if (error) {
        logger.warn(`invalid query :`, error.message);
        res.sendStatus(400);
      } else {
        // Object.defineProperty(req, "query", {
        //   value: data,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true,
        // });
        req.valid = { ...req.valid, query: data };
        next();
      }
    } catch (err) {
      logger.error(`failed parsing request query : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }

      /* istanbul ignore else */
      if (err instanceof ZodSchemaError) {
        res.sendStatus(400);
      } else {
        res.sendStatus(500);
      }
    }
  };
}

module.exports = {
  validateBody,
  validateParams,
  validateQuery,
};
