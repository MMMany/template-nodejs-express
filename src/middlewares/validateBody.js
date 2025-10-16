/**
 * a middleware for validate "req.body"
 * @param {import('joi').ObjectSchema} schema
 * @param {import('joi').ValidationOptions} [options]
 */
function validateBody(schema, options = {}) {
  /** @type {RequestHandler} */
  return (req, res, next) => {
    const { error } = schema.validate(req.body, options);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    next();
  };
}

module.exports = validateBody;
