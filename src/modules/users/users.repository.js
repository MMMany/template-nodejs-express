import User from "./models/user.model.js";
import logger from "#shared/utils/logger";
import { IS_DEV } from "#shared/constants";
import { omit } from "lodash-es";

/**
 * @typedef {import('./index.js').UserEntity} UserEntity
 * @typedef {import('./models/user.model.js').UserDocument} UserDocument
 * @typedef {import('./users.dto.js').CreateUserDTO} CreateUserDTO
 * @typedef {import('./users.dto.js').UpdateUserInfoDTO & Partial<Pick<UserEntity, 'permissions'>>} UpdateUserDTO
 * @typedef {import('mongoose').QueryFilter<UserEntity>} QueryFilter
 * @typedef {import('mongoose').ProjectionType<UserEntity>} ProjectionType
 * @typedef {import('mongoose').QueryOptions<UserEntity>} QueryOptions
 */

/**
 * @typedef {object} UserRepository
 * @property {(data: CreateUserDTO) => Promise<UserEntity | null>} createUser
 * @property {(filter: QueryFilter, projection?: ProjectionType, options?: QueryOptions) => Promise<UserEntity[]>} findUsers
 * @property {(id: string) => Promise<UserEntity | null>} findUserById
 * @property {(id: string, data: UpdateUserDTO) => Promise<UserEntity | null>} updateUserById
 * @property {(id: string) => Promise<UserEntity | null>} deleteUserById
 */

/**
 * @param {UserDocument | null} doc
 * @returns {UserEntity}
 */
const filterPrivacy = (doc) => {
  const converted = doc?.toObject();
  if (!converted) return null;
  return omit(converted, ["password"]);
};

/** @type {UserRepository['createUser']} */
export const createUser = async (data) => {
  try {
    /** @type {UserDocument} */
    const user = await User.create(data);
    return filterPrivacy(user);
  } catch (err) /* istanbul ignore next */ {
    logger.error(`failed creating new item : ${err.message}`);
    if (IS_DEV) {
      logger.error(err.stack || `${err.name}: ${err.message}`);
    }
    return null;
  }
};

/** @type {UserRepository['findUsers']} */
export const findUsers = async (filter, projection = {}, options = {}) => {
  /** @type {UserDocument[]} */
  const users = await User.find(filter, projection, options);
  return users.map((it) => filterPrivacy(it)).filter(Boolean);
};

/** @type {UserRepository['findUserById']} */
export const findUserById = async (id) => {
  /** @type {UserDocument} */
  const user = await User.findById(id);
  return filterPrivacy(user);
};

/** @type {UserRepository['updateUserById']} */
export const updateUserById = async (id, data) => {
  /** @type {UserDocument} */
  const user = await User.findById(id);
  if (!user) {
    return null;
  }
  Object.entries(data).forEach(([k, v]) => {
    user[k] = v;
  });
  const newUser = await user.save();
  return filterPrivacy(newUser);
};

/** @type {UserRepository['deleteUserById']} */
export const deleteUserById = async (id) => {
  /** @type {UserDocument} */
  const user = await User.findByIdAndDelete(id);
  return filterPrivacy(user);
};
