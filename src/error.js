// src/error.js

import { StatusCodes, ReasonPhrases } from "http-status-codes";

class HttpBaseError extends Error {
  constructor(message = "Unexpected Error") {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = -1;
  }
}

// 4xx
class HttpBadRequest extends HttpBaseError {
  constructor(message = ReasonPhrases.BAD_REQUEST) {
    super(message);
    this.status = StatusCodes.BAD_REQUEST;
  }
}

class HttpUnauthorized extends HttpBaseError {
  constructor(message = ReasonPhrases.UNAUTHORIZED) {
    super(message);
    this.status = StatusCodes.UNAUTHORIZED;
  }
}

class HttpForbidden extends HttpBaseError {
  constructor(message = ReasonPhrases.FORBIDDEN) {
    super(message);
    this.status = StatusCodes.FORBIDDEN;
  }
}

class HttpNotFound extends HttpBaseError {
  constructor(message = ReasonPhrases.NOT_FOUND) {
    super(message);
    this.status = StatusCodes.NOT_FOUND;
  }
}

class HttpMethodNotAllowed extends HttpBaseError {
  constructor(message = ReasonPhrases.METHOD_NOT_ALLOWED) {
    super(message);
    this.status = StatusCodes.METHOD_NOT_ALLOWED;
  }
}

class HttpRequestTimeout extends HttpBaseError {
  constructor(message = ReasonPhrases.REQUEST_TIMEOUT) {
    super(message);
    this.status = StatusCodes.REQUEST_TIMEOUT;
  }
}

// 5xx
class HttpInternalServerError extends HttpBaseError {
  constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR) {
    super(message);
    this.status = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

class HttpNotImplemented extends HttpBaseError {
  constructor(message = ReasonPhrases.NOT_IMPLEMENTED) {
    super(message);
    this.status = StatusCodes.NOT_IMPLEMENTED;
  }
}

class HttpBadGateway extends HttpBaseError {
  constructor(message = ReasonPhrases.BAD_GATEWAY) {
    super(message);
    this.status = StatusCodes.BAD_GATEWAY;
  }
}

class HttpServiceUnavailable extends HttpBaseError {
  constructor(message = ReasonPhrases.SERVICE_UNAVAILABLE) {
    super(message);
    this.status = StatusCodes.SERVICE_UNAVAILABLE;
  }
}

class HttpGatewayTimeout extends HttpBaseError {
  constructor(message = ReasonPhrases.GATEWAY_TIMEOUT) {
    super(message);
    this.status = StatusCodes.GATEWAY_TIMEOUT;
  }
}

export {
  HttpBaseError,
  HttpBadRequest,
  HttpUnauthorized,
  HttpForbidden,
  HttpNotFound,
  HttpMethodNotAllowed,
  HttpRequestTimeout,
  HttpInternalServerError,
  HttpNotImplemented,
  HttpBadGateway,
  HttpServiceUnavailable,
  HttpGatewayTimeout,
};
