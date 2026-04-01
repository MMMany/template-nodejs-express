export {};

import type { Request, Response, NextFunction } from "express";

declare global {
  type APIRequest<reqParams = any, resBody = any, reqBody = any, reqQuery = any> = Request<
    reqParams,
    resBody,
    reqBody,
    reqQuery
  >;

  type APIResponse<resBody = any> = Response<resBody>;

  type APIRequestHandler<reqParams = any, resBody = any, reqBody = any, reqQuery = any> = (
    req: Request<reqParams, resBody, reqBody, reqQuery> & {
      valid: {
        body: reqBody;
        params: reqParams;
        query: reqQuery;
      };
    },
    res: Response<resBody>,
    next: NextFunction,
  ) => void | Promise<void> | any;
}
