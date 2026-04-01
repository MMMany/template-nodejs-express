import { IS_DEV } from "#src/shared/utils/constants.js";
import logger from "#src/shared/utils/logger.js";
import { isPlainObject, merge } from "lodash-es";
import { z } from "zod";

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

const buildValidator =
  (type) =>
  (schema) =>
  /** @type {APIRequestHandler} */
  (req, res, next) => {
    try {
      const { data, error } = asZodType(schema).safeParse(req[type]);
      if (error) {
        logger.warn(`invalid ${type} :`, error.message);
        res.sendStatus(400);
      } else {
        req.valid = merge(req.valid, { [type]: data });
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

export const validateBody = buildValidator("body");
export const validateParams = buildValidator("params");
export const validateQuery = buildValidator("query");
