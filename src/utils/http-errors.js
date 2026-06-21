class HttpError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   */
  constructor(message = "", statusCode = 500) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class HttpBadRequest extends HttpError {
  constructor(message = "") {
    super(message, 400);
    this.name = "HttpBadRequest";
  }
}

class HttpUnauthorized extends HttpError {
  constructor(message = "") {
    super(message, 401);
    this.name = "HttpUnauthorized";
  }
}

class HttpForbidden extends HttpError {
  constructor(message = "") {
    super(message, 403);
    this.name = "HttpForbidden";
  }
}

class HttpNotFound extends HttpError {
  constructor(message = "") {
    super(message, 404);
    this.name = "HttpNotFound";
  }
}

class HttpConflict extends HttpError {
  constructor(message = "") {
    super(message, 409);
    this.name = "HttpConflict";
  }
}

class HttpInternalServerError extends HttpError {
  constructor(message = "") {
    super(message, 500);
    this.name = "HttpInternalServerError";
  }
}

const isHttpError = (err) => err instanceof HttpError;

module.exports = {
  HttpError,
  HttpBadRequest,
  HttpUnauthorized,
  HttpForbidden,
  HttpNotFound,
  HttpConflict,
  HttpInternalServerError,
  isHttpError,
};
