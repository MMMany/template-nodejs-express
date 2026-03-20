const { isEmpty, isEqual } = require("lodash");
const logger = require("#/utils/logger");
const { IS_DEV } = require("#/utils/constants");

/** @type {UserModule.UserController['createUser']} */
const createUser =
  ({ service }) =>
  async (req, res) => {
    try {
      const data = req.body;
      const result = await service(data);
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

/** @type {UserModule.UserController['findUsers']} */
const findUsers = ({ service }) => {
  return async (req, res) => {
    try {
      const filter = req.query;
      const result = await service(filter);
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

/** @type {UserModule.UserController['userProfile']} */
const userProfile = ({ service }) => {
  return async (req, res) => {
    try {
      const id = req.params.id;
      const result = await service(id);
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

/** @type {UserModule.UserController['updateUserInfo']} */
const updateUserInfo = ({ service }) => {
  return async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;

      if (isEmpty(data)) {
        logger.warn(`No data`);
        res.sendStatus(400);
        return;
      }

      const result = await service(id, data);
      if (isEmpty(result)) {
        logger.warn(`User "${id}" not found`);
        res.sendStatus(404);
      } else {
        const notModified = isEqual(result.old, result.new);
        if (notModified) {
          res.sendStatus(304);
        } else {
          res.json(result.new);
        }
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

/** @type {UserModule.UserController['updateUserPermissions']} */
const updateUserPermissions = ({ service }) => {
  return async (req, res) => {
    try {
      const id = req.params.id;
      const permsOperation = req.body;
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

      const result = await service(id, permsOperation);
      if (isEmpty(result)) {
        logger.warn(`User "${id}" not found`);
        res.sendStatus(404);
      } else {
        const notModified = isEqual(result.old?.permissions, result.new?.permissions);
        if (notModified) {
          res.sendStatus(304);
        } else {
          res.json(result.new);
        }
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

/** @type {UserModule.UserController['deleteUser']} */
const deleteUser = ({ service }) => {
  return async (req, res) => {
    try {
      const id = req.params.id;
      const result = await service(id);
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

module.exports = {
  createUser,
  findUsers,
  userProfile,
  updateUserInfo,
  updateUserPermissions,
  deleteUser,
};
