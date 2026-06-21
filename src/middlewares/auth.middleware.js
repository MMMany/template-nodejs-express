const { verifyAccessToken } = require("#/utils/jwt");
const { isEmpty } = require("lodash");
const { HttpUnauthorized, isHttpError, HttpForbidden } = require("#/utils/http-errors");
const { formatFail, formatError } = require("#/utils/response-format");
const { getPermissions, PERMISSIONS } = require("#/modules/auth/auth.utils");

const validateAuth = (...allowed) => {
  const allowedPerms = getPermissions(...allowed);

  /** @type {APIRequestHandler} */
  return async (req, res, next) => {
    try {
      const authorization = req.headers?.authorization || "";
      if (!authorization.startsWith("Bearer ")) {
        throw new HttpUnauthorized("Invalid authorization header");
      }
      const accessToken = authorization.split(" ")[1];

      const { uid, userId, perms, tokenVersion } = await verifyAccessToken(accessToken);
      const isAdmin = perms.includes(PERMISSIONS.system.admin);

      if (isEmpty(allowedPerms) || isAdmin) {
        req.user = { uid, userId, perms, tokenVersion, isAdmin };
      } else {
        const isAllowed = perms.some((perm) => allowedPerms.has(perm));
        if (!isAllowed) {
          throw new HttpForbidden("You don't have permission to access this feature");
        }
        req.user = { uid, userId, perms, tokenVersion, isAdmin };
      }

      next();
    } catch (err) {
      res.clearCookie(process.env.AUTH_REFRESH_COOKIE_NAME);
      if (isHttpError(err)) {
        res.status(err.status).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed auth"));
      }
    }
  };
};

module.exports = {
  validateAuth,
};
