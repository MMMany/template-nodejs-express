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

  type APIRequestHandler<resBody = any, reqBody = any, reqQuery = any, reqParmas = any> = (
    req: Request<reqParmas, resBody, reqBody, reqQuery>,
    res: Response<resBody>,
    next: NextFunction,
  ) => void | Promise<void>;
}
