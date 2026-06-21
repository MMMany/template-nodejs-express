const {
  HttpBadRequest,
  HttpNotFound,
  isHttpError,
  HttpInternalServerError,
  HttpUnauthorized,
} = require("#/utils/http-errors");
const logger = require("#/utils/logger");
const { isEmpty } = require("lodash");
const { userResponseDTO, roleResponseDTO } = require("./auth.dto");
const { v7: uuidv7 } = require("uuid");
const { IS_DEV } = require("#/utils/constants");
const { generateSecureRandomString, ALL_PERMISSIONS } = require("./auth.utils");
const bcrypt = require("bcrypt");
const { generateToken, verifyRefreshToken } = require("#/utils/jwt");

/**
 * @typedef {object} AuthService
 * @property {(data: import('./auth.dto').CreateUserDTO) => Promise<import('./auth.dto').UserResponseDTO>} createUser
 * @property {(filter: import('./auth.dto').FindUsersQuery) => Promise<import('./auth.dto').UserResponseDTO[]>} findUsers
 * @property {(uid: string) => Promise<import('./auth.dto').UserResponseDTO>} getUser
 * @property {(uid: string, data: import('./auth.dto').UpdateUserInfoDTO) => Promise<import('./auth.dto').UserResponseDTO>} updateUserInfo
 * @property {(uid: string, password: string, resetCode: string) => Promise<import('./auth.dto').UserResponseDTO>} updatePassword
 * @property {(uid: string) => Promise<string>} requestResetCode
 * @property {(uid: string) => Promise<import('./auth.dto').UserResponseDTO>} deleteUser
 * @property {(data: import('./auth.dto').CreateRoleDTO) => Promise<import('./auth.dto').RoleResponseDTO>} createRole
 * @property {(filter: import('./auth.dto').FindRolesQuery) => Promise<import('./auth.dto').RoleResponseDTO[]>} findRoles
 * @property {(key: string) => Promise<import('./auth.dto').RoleResponseDTO>} getRole
 * @property {(key: string, data: import('./auth.dto').UpdateRoleDTO) => Promise<import('./auth.dto').RoleResponseDTO>} updateRole
 * @property {(key: string) => Promise<import('./auth.dto').RoleResponseDTO>} deleteRole
 * @property {(search: string) => Promise<string[]>} findPermissions
 * @property {(userId: string, password: string) => Promise<import('./auth.dto').LoginResponseDTO & { refreshToken: string }>} login
 * @property {(token: string) => Promise<import('./auth.dto').LoginResponseDTO & { refreshToken: string }>} refreshToken
 * @property {(uid: string) => Promise<void>} logoutAllDevice
 */

/**
 * @param {import('./auth.repository').AuthRepository} repository
 * @returns {AuthService}
 */
const createUserService = (repository) => {
  /**
   * @type {AuthService['createUser']}
   */
  const createUser = async (data) => {
    try {
      const uid = uuidv7();
      const encrypted = { ...data, uid, password: await bcrypt.hash(data.password, 10) };
      const user = await repository.createUser(encrypted);
      if (!user) {
        throw new HttpBadRequest("Cannot create new user");
      }
      return userResponseDTO.parse(user);
    } catch (err) {
      logger.error(`failed create new user : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed create new user");
      }
    }
  };

  /**
   * @type {AuthService['findUsers']}
   */
  const findUsers = async (filter) => {
    try {
      const users = await repository.findUsers(filter);
      if (isEmpty(users)) {
        throw new HttpNotFound("Not Found Users");
      }
      return users.map((user) => userResponseDTO.parse(user));
    } catch (err) {
      logger.error(`failed find users : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed find users");
      }
    }
  };

  /**
   * @type {AuthService['getUser']}
   */
  const getUser = async (uid) => {
    try {
      const user = await repository.getUser(uid);
      if (!user) {
        throw new HttpNotFound("Not Found User");
      }
      return userResponseDTO.parse(user);
    } catch (err) {
      logger.error(`failed get user : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed get user");
      }
    }
  };

  /**
   * @type {AuthService['updateUserInfo']}
   */
  const updateUserInfo = async (uid, data) => {
    try {
      const { roles, ...others } = data;
      let user = await repository.updateUserInfo(uid, others);
      if (!user) {
        throw new HttpNotFound("Not Found User");
      }
      if (roles) {
        user = await repository.updateUserRoles(uid, roles);
      }
      return userResponseDTO.parse(user);
    } catch (err) {
      logger.error(`failed update user info : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed update user info");
      }
    }
  };

  /**
   * @type {AuthService['updatePassword']}
   */
  const updatePassword = async (uid, password, resetCode) => {
    try {
      const encrypted = await bcrypt.hash(password, 10);
      const user = await repository.updatePassword(uid, encrypted, resetCode);
      if (!user) {
        throw new HttpNotFound("Not Found User");
      }
      return userResponseDTO.parse(user);
    } catch (err) {
      logger.error(`failed update user password : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed update user password");
      }
    }
  };

  /**
   * @type {AuthService['requestResetCode']}
   */
  const requestResetCode = async (uid) => {
    try {
      const code = generateSecureRandomString(8);
      const result = await repository.setResetCode(uid, code);
      if (!result) {
        throw new HttpNotFound("Not Found User");
      }
    } catch (err) {
      logger.error(`failed request reset code : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed request reset code");
      }
    }
  };

  /**
   * @type {AuthService['deleteUser']}
   */
  const deleteUser = async (uid) => {
    try {
      const user = await repository.deleteUser(uid);
      if (!user) {
        throw new HttpNotFound("Not Found User");
      }
      return userResponseDTO.parse(user);
    } catch (err) {
      logger.error(`failed delete user : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed delete user");
      }
    }
  };

  /**
   * @type {AuthService['createRole']}
   */
  const createRole = async (data) => {
    try {
      const role = await repository.createRole(data);
      if (!role) {
        throw new HttpBadRequest("Cannot create new role");
      }
      return roleResponseDTO.parse(role);
    } catch (err) {
      logger.error(`failed create role : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed create role");
      }
    }
  };

  /**
   * @type {AuthService['findRoles']}
   */
  const findRoles = async (filter) => {
    try {
      const roles = await repository.findRoles(filter);
      if (isEmpty(roles)) {
        throw new HttpNotFound("Not Found Roles");
      }
      return roles.map((role) => roleResponseDTO.parse(role));
    } catch (err) {
      logger.error(`failed find roles : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed find roles");
      }
    }
  };

  /**
   * @type {AuthService['getRole']}
   */
  const getRole = async (key) => {
    try {
      const role = await repository.getRole(key);
      if (!role) {
        throw new HttpNotFound("Not Found Role");
      }
      return roleResponseDTO.parse(role);
    } catch (err) {
      logger.error(`failed get role : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed get role");
      }
    }
  };

  /**
   * @type {AuthService['updateRole']}
   */
  const updateRole = async (key, data) => {
    try {
      const role = await repository.updateRole(key, data);
      if (!role) {
        throw new HttpNotFound("Not Found Role");
      }
      return roleResponseDTO.parse(role);
    } catch (err) {
      logger.error(`failed update role : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed update role");
      }
    }
  };

  /**
   * @type {AuthService['deleteRole']}
   */
  const deleteRole = async (key) => {
    try {
      const role = await repository.deleteRole(key);
      if (!role) {
        throw new HttpNotFound("Not Found Role");
      }
      return roleResponseDTO.parse(role);
    } catch (err) {
      logger.error(`failed delete role : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed delete role");
      }
    }
  };

  /**
   * @type {AuthService['findPermissions']}
   */
  const findPermissions = async (search) => {
    try {
      if (isEmpty(search)) {
        return ALL_PERMISSIONS;
      }
      const lowerSearch = search.toLowerCase();
      return ALL_PERMISSIONS.filter((perm) => perm.toLowerCase().includes(lowerSearch));
    } catch (err) {
      logger.error(`failed find permissions : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed find permissions");
      }
    }
  };

  /**
   * @type {AuthService['login']}
   */
  const login = async (userId, password) => {
    try {
      const user = await repository.getUserByUserId(userId);
      if (!user) {
        throw new HttpUnauthorized("Invalid userId or password");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpUnauthorized("Invalid userId or password");
      }

      const { accessToken, refreshToken } = await generateToken({
        uid: user.uid,
        userId: user.userId,
        roles: user.roles,
        tokenVersion: user.tokenVersion,
      });

      const result = await repository.increaseTokenVersion(user.uid);
      if (!result) {
        throw new HttpInternalServerError("Failed login");
      }

      return {
        accessToken,
        refreshToken,
        user: userResponseDTO.parse(user),
      };
    } catch (err) {
      logger.error(`failed login : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed login");
      }
    }
  };

  /**
   * @type {AuthService['refreshToken']}
   */
  const refreshToken = async (token) => {
    try {
      const decoded = await verifyRefreshToken(token);
      const user = await repository.getUser(decoded.uid);
      if (!user) {
        throw new HttpUnauthorized("Invalid user");
      }

      const { accessToken, refreshToken } = await generateToken({
        uid: user.uid,
        userId: user.userId,
        roles: user.roles,
        tokenVersion: user.tokenVersion,
      });

      const result = await repository.increaseTokenVersion(user.uid);
      if (!result) {
        throw new HttpInternalServerError("Failed refresh token");
      }

      return {
        accessToken,
        refreshToken,
        user: userResponseDTO.parse(user),
      };
    } catch (err) {
      logger.error(`failed refresh token : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed refresh token");
      }
    }
  };

  /**
   * @type {AuthService['logoutAllDevice']}
   */
  const logoutAllDevice = async (uid) => {
    try {
      const result = await repository.increaseTokenVersion(uid);
      if (!result) {
        throw new HttpNotFound("Not Found User");
      }
    } catch (err) {
      logger.error(`failed logout all device : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      if (isHttpError(err)) {
        throw err;
      } else {
        throw new HttpInternalServerError("Failed logout all device");
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
    refreshToken,
    logoutAllDevice,
  };
};

module.exports = createUserService;
