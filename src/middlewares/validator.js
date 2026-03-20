const { IS_DEV } = require("#/utils/constants");
const logger = require("#/utils/logger");
const { isPlainObject } = require("lodash");
const z = require("zod");

/* istanbul ignore next */
class ZodSchemaError extends Error {
  constructor(message) {
    super(message);
    this.name = "ZodSchemaError";
  }
}

function asZodType(obj) {
  if (obj instanceof z.ZodType) {
    return obj;
  } else if (isPlainObject(obj)) {
    return z.object(obj);
  } else {
    throw new ZodSchemaError("invalid schema");
  }
}

function validateBody(schema) {
  /** @type {APIRequestHandler} */
  return (req, res, next) => {
    try {
      const { data, error } = asZodType(schema).safeParse(req.body);
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
    } catch (err) /* istanbul ignore next */ {
      logger.error(`failed parsing request body : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }

      if (err instanceof ZodSchemaError) {
        res.sendStatus(400);
      } else {
        res.sendStatus(500);
      }
    }
  };
}

function validateParams(schema) {
  /** @type {APIRequestHandler} */
  return (req, res, next) => {
    try {
      const { data, error } = asZodType(schema).safeParse(req.params);
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
    } catch (err) /* istanbul ignore next */ {
      logger.error(`failed parsing request params : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }

      if (err instanceof ZodSchemaError) {
        res.sendStatus(400);
      } else {
        res.sendStatus(500);
      }
    }
  };
}

function validateQuery(schema) {
  /** @type {APIRequestHandler} */
  return (req, res, next) => {
    try {
      const { data, error } = asZodType(schema).safeParse(req.query);
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
    } catch (err) /* istanbul ignore next */ {
      logger.error(`failed parsing request query : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }

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
