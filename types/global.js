/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * @callback AsyncRequestHandler
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<any>}
 */

/** @typedef {import('express').RequestHandler | AsyncRequestHandler} _RequestHandler */
