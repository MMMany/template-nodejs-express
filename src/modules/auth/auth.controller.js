const { isHttpError, HttpUnauthorized, HttpForbidden } = require("#/utils/http-errors");
const { formatSuccess, formatFail, formatError } = require("#/utils/response-format");
const { PERMISSIONS } = require("./auth.utils");

/**
 * @typedef {object} AuthController
 * @property {APIRequestHandler<null, FormatResponse<import('./auth.dto').UserResponseDTO>, import('./auth.dto').CreateUserDTO>} createUser
 * @property {APIRequestHandler<null, FormatResponse<import('./auth.dto').UserResponseDTO[]>, null, import('./auth.dto').FindUsersQuery>} findUsers
 * @property {APIRequestHandler<import('./auth.dto').UidParams, FormatResponse<import('./auth.dto').UserResponseDTO>>} getUser
 * @property {APIRequestHandler<import('./auth.dto').UidParams, FormatResponse<import('./auth.dto').UserResponseDTO>, import('./auth.dto').UpdateUserInfoDTO>} updateUserInfo
 * @property {APIRequestHandler<import('./auth.dto').UidParams, FormatResponse<import('./auth.dto').UserResponseDTO>, import('./auth.dto').UpdatePasswordDTO>} updatePassword
 * @property {APIRequestHandler<import('./auth.dto').UidParams, FormatResponse<string>>} requestResetCode
 * @property {APIRequestHandler<import('./auth.dto').UidParams, FormatResponse<import('./auth.dto').UserResponseDTO>>} deleteUser
 * @property {APIRequestHandler<null, FormatResponse<import('./auth.dto').RoleResponseDTO>, import('./auth.dto').CreateRoleDTO>} createRole
 * @property {APIRequestHandler<null, FormatResponse<import('./auth.dto').RoleResponseDTO[]>, null, import('./auth.dto').FindRolesQuery>} findRoles
 * @property {APIRequestHandler<import('./auth.dto').KeyParams, FormatResponse<import('./auth.dto').RoleResponseDTO>>} getRole
 * @property {APIRequestHandler<import('./auth.dto').KeyParams, FormatResponse<import('./auth.dto').RoleResponseDTO>, import('./auth.dto').UpdateRoleDTO>} updateRole
 * @property {APIRequestHandler<import('./auth.dto').KeyParams, FormatResponse<import('./auth.dto').RoleResponseDTO>>} deleteRole
 * @property {APIRequestHandler<null, FormatResponse<string[]>, null, import('./auth.dto').FindPermsQuery>} findPermissions
 * @property {APIRequestHandler<null, FormatResponse<import('./auth.dto').LoginResponseDTO>, import('./auth.dto').LoginDTO>} login
 * @property {APIRequestHandler<null, FormatResponse<void>>} logout
 * @property {APIRequestHandler<null, FormatResponse<import('./auth.dto').LoginResponseDTO>>} refreshToken
 * @property {APIRequestHandler<null, FormatResponse<void>>} logoutAllDevice
 */

/**
 * @param {import('./auth.service').AuthService} service
 * @returns {AuthController}
 */
const createUserController = (service) => {
  /**
   * for system admin
   * @type {AuthController['createUser']}
   */
  const createUser = async (req, res) => {
    try {
      const body = req.valid?.body ?? req.body;
      const result = await service.createUser(body);
      res.status(201).json(formatSuccess("Create new user success", result));
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed create new user"));
      }
    }
  };

  /**
   * for auth admin
   * @type {AuthController['findUsers']}
   */
  const findUsers = async (req, res) => {
    try {
      const query = req.valid?.query ?? req.query;
      const result = await service.findUsers(query);
      res.status(200).json(formatSuccess("Find users success", result));
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed find users"));
      }
    }
  };

  /**
   * @type {AuthController['getUser']}
   */
  const getUser = async (req, res) => {
    try {
      const params = req.valid?.params ?? req.params;
      const user = req.user ?? {};
      if (user.isAdmin || user.perms?.includes(PERMISSIONS.auth.read) || params.uid === user.uid) {
        const result = await service.getUser(params.uid);
        res.status(200).json(formatSuccess("Get user success", result));
        return;
      }
      throw new HttpForbidden("You don't have permission to access this feature");
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed get user"));
      }
    }
  };

  /**
   * @type {AuthController['updateUserInfo']}
   */
  const updateUserInfo = async (req, res) => {
    try {
      const params = req.valid?.params ?? req.params;
      const body = req.valid?.body ?? req.body;
      const user = req.user ?? {};
      if (user.isAdmin || user.perms?.includes(PERMISSIONS.auth.update) || params.uid === user.uid) {
        const result = await service.updateUserInfo(params.uid, body);
        res.status(200).json(formatSuccess("Update user info success", result));
        return;
      }
      throw new HttpForbidden("You don't have permission to access this feature");
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed update user info"));
      }
    }
  };

  /**
   * @type {AuthController['updatePassword']}
   */
  const updatePassword = async (req, res) => {
    try {
      const params = req.valid?.params ?? req.params;
      const body = req.valid?.body ?? req.body;
      const result = await service.updatePassword(params.uid, body.password);
      res.status(200).json(formatSuccess("Update user password success", result));
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed update user password"));
      }
    }
  };

  /**
   * @type {AuthController['requestResetCode']}
   */
  const requestResetCode = async (req, res) => {
    try {
      const params = req.valid?.params ?? req.params;
      const result = await service.requestResetCode(params.uid);
      res.status(200).json(formatSuccess("Request reset code success", result));
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed request reset code"));
      }
    }
  };

  /**
   * for system admin
   * @type {AuthController['deleteUser']}
   */
  const deleteUser = async (req, res) => {
    try {
      const params = req.valid?.params ?? req.params;
      const result = await service.deleteUser(params.uid);
      res.status(200).json(formatSuccess("Delete user success", result));
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed delete user"));
      }
    }
  };

  /**
   * for auth admin
   * @type {AuthController['createRole']}
   */
  const createRole = async (req, res) => {
    try {
      const body = req.valid?.body ?? req.body;
      const result = await service.createRole(body);
      res.status(201).json(formatSuccess("Create new role success", result));
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed create new role"));
      }
    }
  };

  /**
   * for auth admin
   * @type {AuthController['findRoles']}
   */
  const findRoles = async (req, res) => {
    try {
      const query = req.valid?.query ?? req.query;
      const result = await service.findRoles(query);
      res.status(200).json(formatSuccess("Find roles success", result));
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed find roles"));
      }
    }
  };

  /**
   * for auth admin
   * @type {AuthController['getRole']}
   */
  const getRole = async (req, res) => {
    try {
      const params = req.valid?.params ?? req.params;
      const result = await service.getRole(params.key);
      res.status(200).json(formatSuccess("Get role success", result));
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed get role"));
      }
    }
  };

  /**
   * for auth admin
   * @type {AuthController['updateRole']}
   */
  const updateRole = async (req, res) => {
    try {
      const params = req.valid?.params ?? req.params;
      const body = req.valid?.body ?? req.body;
      const result = await service.updateRole(params.key, body);
      res.status(200).json(formatSuccess("Update role success", result));
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed update role"));
      }
    }
  };

  /**
   * for auth admin
   * @type {AuthController['deleteRole']}
   */
  const deleteRole = async (req, res) => {
    try {
      const params = req.valid?.params ?? req.params;
      const result = await service.deleteRole(params.key);
      res.status(200).json(formatSuccess("Delete role success", result));
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed delete role"));
      }
    }
  };

  /**
   * for auth admin
   * @type {AuthController['findPermissions']}
   */
  const findPermissions = async (req, res) => {
    try {
      const query = req.valid?.query ?? req.query;
      const result = await service.findPermissions(query.search);
      res.status(200).json(formatSuccess("Find permissions success", result));
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed find permissions"));
      }
    }
  };

  /**
   * @type {AuthController['login']}
   */
  const login = async (req, res) => {
    try {
      const { userId, password } = req.valid?.body ?? req.body;
      const { accessToken, refreshToken, user } = await service.login(userId, password);

      res.cookie(process.env.AUTH_REFRESH_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      res.status(200).json(
        formatSuccess("Login success", {
          accessToken,
          user,
        }),
      );
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed login"));
      }
    }
  };

  /**
   * @type {AuthController['logout']}
   */
  const logout = async (req, res) => {
    try {
      res.clearCookie(process.env.AUTH_REFRESH_COOKIE_NAME);
      res.status(200).json(formatSuccess("Logout success"));
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed logout"));
      }
    }
  };

  /**
   * @type {AuthController['refreshToken']}
   */
  const refreshToken = async (req, res) => {
    try {
      const refreshToken = req.cookies[process.env.AUTH_REFRESH_COOKIE_NAME];
      const { accessToken, refreshToken: newRefreshToken, user } = await service.refreshToken(refreshToken);
      res.cookie(process.env.AUTH_REFRESH_COOKIE_NAME, newRefreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      res.status(200).json(
        formatSuccess("Refresh token success", {
          accessToken,
          user,
        }),
      );
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed refresh token"));
      }
    }
  };

  /**
   * @type {AuthController['logoutAllDevice']}
   */
  const logoutAllDevice = async (req, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        throw new HttpUnauthorized("Invalid user");
      }
      await service.logoutAllDevice(uid);
      res.clearCookie(process.env.AUTH_REFRESH_COOKIE_NAME);
      res.status(200).json(formatSuccess("Logout from all devices success"));
    } catch (err) {
      if (isHttpError(err)) {
        res.status(err.statusCode).json(formatFail(err.message));
      } else {
        res.status(500).json(formatError("Failed logout from all devices"));
      }
    }
  };

  return {
    createUser,
    findUsers,
    getUser,
    updateUserInfo,
    updatePassword,
    requestResetCode,
    deleteUser,
    createRole,
    findRoles,
    getRole,
    updateRole,
    deleteRole,
    findPermissions,
    login,
    logout,
    refreshToken,
    logoutAllDevice,
  };
};

module.exports = createUserController;
