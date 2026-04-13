/**
 * @typedef {import("./services/users.provider.js").UserService} UserService
 * @typedef {import('./index.js').UserEntity} UserEntity
 * @typedef {import('./users.dto.js').CreateUserDTO} CreateUserDTO
 * @typedef {import('./users.dto.js').UpdateUserInfoDTO} UpdateUserInfoDTO
 * @typedef {import('./users.dto.js').UpdateUserPermissionsDTO} UpdateUserPermissionsDTO
 * @typedef {import('./users.dto.js').FindUsersQueryDTO} FindUsersQueryDTO
 * @typedef {import('./users.dto.js').IdParams} IdParams
 */

/**
 * @typedef {ReturnType<buildUserController>} UserController
 */

import { isEmpty, isEqual } from "lodash-es";
import logger from "#shared/utils/logger";
import { IS_DEV } from "#shared/constants";

/**
 * @param {UserService} service
 * @returns {APIRequestHandler<null, UserEntity, CreateUserDTO, null>}
 */
const createUser = (service) => async (req, res) => {
  try {
    const data = req.valid.body;
    const result = await service.createUser(data);
    if (result) {
      res.json(result);
    } else {
      logger.warn("failed creating user");
      res.sendStatus(400);
    }
  } catch (err) /* istanbul ignore next */ {
    logger.error(`Error creating user : ${err.message}`);
    if (IS_DEV) {
      logger.error(err.stack || `${err.name}: ${err.message}`);
    }
    res.sendStatus(500);
  }
};

/**
 * @param {UserService} service
 * @returns {APIRequestHandler<null, UserEntity[], null, FindUsersQueryDTO>}
 */
const findUsers = (service) => {
  return async (req, res) => {
    try {
      const filter = req.valid.query;
      const result = await service.findUsers(filter);
      if (isEmpty(result)) {
        logger.warn(`User not found`);
        res.sendStatus(404);
      } else {
        res.json(result);
      }
    } catch (err) /* istanbul ignore next */ {
      logger.error(`Error finding users : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      res.sendStatus(500);
    }
  };
};

/**
 * @param {UserService} service
 * @returns {APIRequestHandler<IdParams, UserEntity, null, null>}
 */
const userProfile = (service) => {
  return async (req, res) => {
    try {
      const id = req.valid.params.id;
      const result = await service.findUserById(id);
      if (isEmpty(result)) {
        logger.warn(`User "${id}" not found`);
        res.sendStatus(404);
      } else {
        res.json(result);
      }
    } catch (err) /* istanbul ignore next */ {
      logger.error(`Error finding user profile : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      res.sendStatus(500);
    }
  };
};

/**
 * @param {UserService} service
 * @returns {APIRequestHandler<IdParams, UserEntity, UpdateUserInfoDTO, null>}
 */
const updateUserInfo = (service) => {
  return async (req, res) => {
    try {
      const id = req.valid.params.id;
      const data = req.valid.body;

      if (isEmpty(data)) {
        logger.warn(`No data`);
        res.sendStatus(400);
        return;
      }

      const result = await service.updateUserInfo(id, data);
      if (isEmpty(result)) {
        logger.warn(`User "${id}" not found`);
        res.sendStatus(404);
      } else {
        res.json(result);
      }
    } catch (err) /* istanbul ignore next */ {
      logger.error(`Error updating user info : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      res.sendStatus(500);
    }
  };
};

/**
 * @param {UserService} service
 * @returns {APIRequestHandler<IdParams, UserEntity, UpdateUserPermissionsDTO, null>}
 */
const updateUserPermissions = (service) => {
  return async (req, res) => {
    try {
      const id = req.valid.params.id;
      const permsOperation = req.valid.body;
      if (isEmpty(permsOperation?.add) && isEmpty(permsOperation?.remove)) {
        logger.warn(`No data`);
        res.sendStatus(400);
        return;
      }
      if (isEqual(permsOperation?.add, permsOperation?.remove)) {
        logger.warn(`Invalid body: no change`);
        res.sendStatus(400);
        return;
      }

      const result = await service.updateUserPermissions(id, permsOperation);
      if (isEmpty(result)) {
        logger.warn(`User "${id}" not found`);
        res.sendStatus(404);
      } else {
        res.json(result);
      }
    } catch (err) /* istanbul ignore next */ {
      logger.error(`Error updating user permissions : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      res.sendStatus(500);
    }
  };
};

/**
 * @param {UserService} service
 * @returns {APIRequestHandler<IdParams, UserEntity, null, null>}
 */
const deleteUser = (service) => {
  return async (req, res) => {
    try {
      const id = req.valid.params.id;
      const result = await service.deleteUser(id);
      if (isEmpty(result)) {
        logger.warn(`User "${id}" not found`);
        res.sendStatus(400);
      } else {
        res.json(result);
      }
    } catch (err) /* istanbul ignore next */ {
      logger.error(`Error deleting user : ${err.message}`);
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      res.sendStatus(500);
    }
  };
};

/**
 * @param {UserService} service
 */
export const buildUserController = (service) => ({
  createUser: createUser(service),
  findUsers: findUsers(service),
  userProfile: userProfile(service),
  updateUserInfo: updateUserInfo(service),
  updateUserPermissions: updateUserPermissions(service),
  deleteUser: deleteUser(service),
});
