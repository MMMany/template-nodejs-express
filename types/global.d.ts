export {};

import type { Request, Response, NextFunction } from "express";

declare global {
  type FormatResponse<T> = {
    status: "success" | "fail" | "error";
    message: string;
    data?: T;
  };

  type APIRequestHandler<reqParams = any, resBody = any, reqBody = any, reqQuery = any> = (
    req: Request<reqParmas, resBody, reqBody, reqQuery> & {
      valid: {
        body: reqBody;
        params: reqParmas;
        query: reqQuery;
      };
    },
    res: Response<resBody>,
    next: NextFunction,
  ) => void | Promise<void>;
}
