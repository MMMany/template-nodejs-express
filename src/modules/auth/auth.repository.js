const { pick } = require("lodash");
const User = require("./models/User");
const Role = require("./models/Role");
const logger = require("#/utils/logger");
const { IS_DEV } = require("#/utils/constants");

const userPickOptions = [
  "uid",
  "userId",
  "password",
  "name",
  "org",
  "roles",
  "resetCode",
  "tokenVersion",
  "status",
  "createdAt",
  "updatedAt",
];
const userSelectOptions = userPickOptions.reduce((prev, it) => ({ ...prev, [it]: 0 }), {});
const rolePickOptions = ["key", "name", "desc", "perms", "status", "createdAt", "updatedAt"];
const roleSelectOptions = rolePickOptions.reduce((prev, it) => ({ ...prev, [it]: 0 }), {});

/**
 * @typedef {{ uid: string } & import('./auth.dto').CreateUserDTO} CreateUserRequest
 * @typedef {Pick<import('./auth').User, "uid"|"userId"|"password"|"name"|"org"|"roles"|"resetCode"|"tokenVersion"|"status"|"createdAt"|"updatedAt">} UserResponse
 * @typedef {import('./auth.dto').CreateRoleDTO} CreateRoleRequest
 * @typedef {Pick<import('./auth').Role, "key"|"name"|"desc"|"perms"|"createdAt"|"updatedAt">} RoleResponse
 */

/**
 * @typedef {object} AuthRepository
 * @property {(data: CreateUserRequest) => Promise<UserResponse | null>} createUser
 * @property {(filter: import('./auth.dto').FindUsersQuery) => Promise<UserResponse[]>} findUsers
 * @property {(uid: string) => Promise<UserResponse | null>} getUser
 * @property {(userId: string) => Promise<UserResponse | null>} getUserByUserId
 * @property {(uid: string, data: Omit<import('./auth.dto').UpdateUserInfoDTO, "roles">) => Promise<UserResponse | null>} updateUserInfo
 * @property {(uid: string, roles: string[]) => Promise<UserResponse | null>} updateUserRoles
 * @property {(uid: string, password: string, resetCode: string) => Promise<UserResponse | null>} updatePassword
 * @property {(uid: string, resetCode: string) => Promise<boolean>} setResetCode
 * @property {(uid: string) => Promise<boolean>} increaseTokenVersion
 * @property {(uid: string) => Promise<UserResponse | null>} deleteUser
 * @property {(data: CreateRoleRequest) => Promise<RoleResponse | null>} createRole
 * @property {(filter: import('./auth.dto').FindRolesQuery) => Promise<RoleResponse[]>} findRoles
 * @property {(key: string) => Promise<RoleResponse | null>} getRole
 * @property {(key: string, data: import('./auth.dto').UpdateRoleDTO) => Promise<RoleResponse | null>} updateRole
 * @property {(key: string) => Promise<RoleResponse | null>} deleteRole
 */

/**
 * @returns {AuthRepository}
 */
const createUserRepository = () => {
  /**
   * @type {AuthRepository['createUser']}
   */
  const createUser = async (data) => {
    try {
      const old = await User.findOneAndUpdate(
        { userId: data.userId, status: "DELETE" },
        { $set: { ...data, status: "ACTIVE", tokenVersion: 0, resetCode: "" } },
        { new: true },
      )
        .select(userSelectOptions)
        .lean();
      if (old) {
        return old;
      }
      const user = await User.create(data);
      return pick(user.toObject(), userPickOptions);
    } catch (err) {
      logger.error(`failed create new user : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return null;
    }
  };

  /**
   * @type {AuthRepository['findUsers']}
   */
  const findUsers = async (filter) => {
    try {
      // convert to include-type filter
      const convertedFilter = {
        userId: filter.userId ? { $regex: filter.userId, $options: "i" } : undefined,
        name: filter.name ? { $regex: filter.name, $options: "i" } : undefined,
        org: filter.org ? { $regex: filter.org, $options: "i" } : undefined,
      };
      const users = await User.find(convertedFilter).select(userSelectOptions).lean();
      return users;
    } catch (err) {
      logger.error(`failed find users : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return null;
    }
  };

  /**
   * @type {AuthRepository['getUser']}
   */
  const getUser = async (uid) => {
    try {
      const user = await User.findOne({ uid }).select(userSelectOptions).lean();
      return user;
    } catch (err) {
      logger.error(`failed get user : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return null;
    }
  };

  /**
   * @type {AuthRepository['getUserByUserId']}
   */
  const getUserByUserId = async (userId) => {
    try {
      const user = await User.findOne({ userId }).select(userSelectOptions).lean();
      return user;
    } catch (err) {
      logger.error(`failed get user by userId : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return null;
    }
  };

  /**
   * @type {AuthRepository['updateUserInfo']}
   */
  const updateUserInfo = async (uid, data) => {
    try {
      const user = await User.findOneAndUpdate({ uid }, { $set: data }, { new: true }).select(userSelectOptions).lean();
      return user;
    } catch (err) {
      logger.error(`failed update user info : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return null;
    }
  };

  /**
   * @type {AuthRepository['updateUserRoles']}
   */
  const updateUserRoles = async (uid, roles) => {
    try {
      const user = await User.findOneAndUpdate({ uid }, { $set: { roles }, $inc: { tokenVersion: 1 } }, { new: true })
        .select(userSelectOptions)
        .lean();
      return user;
    } catch (err) {
      logger.error(`failed update user roles : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return null;
    }
  };

  /**
   * @type {AuthRepository['updatePassword']}
   */
  const updatePassword = async (uid, password, resetCode) => {
    try {
      const user = await User.findOneAndUpdate(
        { uid, resetCode },
        { $set: { password, resetCode: "" }, $inc: { tokenVersion: 1 } },
        { new: true },
      )
        .select(userSelectOptions)
        .lean();
      return user;
    } catch (err) {
      logger.error(`failed update user password : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return null;
    }
  };

  /**
   * @type {AuthRepository['setResetCode']}
   */
  const setResetCode = async (uid, resetCode) => {
    try {
      const result = await User.updateOne({ uid }, { $set: { resetCode }, $inc: { tokenVersion: 1 } });
      return result.modifiedCount > 0;
    } catch (err) {
      logger.error(`failed set reset code : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return false;
    }
  };

  /**
   * @type {AuthRepository['increaseTokenVersion']}
   */
  const increaseTokenVersion = async (uid) => {
    try {
      const result = await User.updateOne({ uid }, { $inc: { tokenVersion: 1 } });
      return result.modifiedCount > 0;
    } catch (err) {
      logger.error(`failed increase token version : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return false;
    }
  };

  /**
   * @type {AuthRepository['deleteUser']}
   */
  const deleteUser = async (uid) => {
    try {
      const user = await User.findOneAndUpdate(
        { uid },
        { $set: { status: "DELETE" }, $inc: { tokenVersion: 1 } },
        { new: true },
      )
        .select(userSelectOptions)
        .lean();
      return user;
    } catch (err) {
      logger.error(`failed delete user : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return null;
    }
  };

  /**
   * @type {AuthRepository['createRole']}
   */
  const createRole = async (data) => {
    try {
      const old = await Role.findOneAndUpdate(
        { key: data.key, status: "DELETE" },
        { $set: { ...data, status: "ACTIVE" } },
        { new: true },
      )
        .select(roleSelectOptions)
        .lean();
      if (old) {
        return old;
      }
      const role = await Role.create(data);
      return pick(role.toObject(), rolePickOptions);
    } catch (err) {
      logger.error(`failed create role : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return null;
    }
  };

  /**
   * @type {AuthRepository['findRoles']}
   */
  const findRoles = async (filter) => {
    try {
      const convertedFilter = {
        key: filter.key ? { $regex: filter.key } : undefined,
        name: filter.name ? { $regex: filter.name } : undefined,
        desc: filter.desc ? { $regex: filter.desc } : undefined,
      };
      const roles = await Role.find(convertedFilter).select(roleSelectOptions).lean();
      return roles;
    } catch (err) {
      logger.error(`failed find roles : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return null;
    }
  };

  /**
   * @type {AuthRepository['getRole']}
   */
  const getRole = async (key) => {
    try {
      const role = await Role.findOne({ key }).select(roleSelectOptions).lean();
      return role;
    } catch (err) {
      logger.error(`failed get role : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return null;
    }
  };

  /**
   * @type {AuthRepository['updateRole']}
   */
  const updateRole = async (key, data) => {
    try {
      const role = await Role.findOneAndUpdate({ key }, { $set: data }, { new: true }).select(roleSelectOptions).lean();
      return role;
    } catch (err) {
      logger.error(`failed update role : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return null;
    }
  };

  /**
   * @type {AuthRepository['deleteRole']}
   */
  const deleteRole = async (key) => {
    try {
      const role = await Role.findOneAndUpdate({ key }, { $set: { status: "DELETE" } }, { new: true })
        .select(roleSelectOptions)
        .lean();
      return role;
    } catch (err) {
      logger.error(`failed delete role : ${err.message}`);
      /* istanbul ignore next */
      if (IS_DEV) {
        logger.error(err.stack || `${err.name}: ${err.message}`);
      }
      return null;
    }
  };

  return {
    createUser,
    findUsers,
    getUser,
    getUserByUserId,
    updateUserInfo,
    updateUserRoles,
    updatePassword,
    setResetCode,
    increaseTokenVersion,
    deleteUser,
    createRole,
    findRoles,
    getRole,
    updateRole,
    deleteRole,
  };
};

module.exports = createUserRepository;
