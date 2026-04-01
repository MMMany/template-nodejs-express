import User from "./models/user.model.js";
import logger from "#src/shared/utils/logger.js";
import { IS_DEV } from "#src/shared/utils/constants.js";

/** @type {UserModule.Repository['createUser']} */
export const createUser = async (data) => {
  try {
    const user = await User.create(data);
    return user?.toObject();
  } catch (err) /* istanbul ignore next */ {
    logger.error(`failed creating new item : ${err.message}`);
    if (IS_DEV) {
      logger.error(err.stack || `${err.name}: ${err.message}`);
    }
    return null;
  }
};

/** @type {UserModule.Repository['findUsers']} */
export const findUsers = async (filter, projection = {}, options = {}) => {
  const users = await User.find(filter, projection, options);
  return users.map((it) => it?.toObject()).filter(Boolean);
};

/** @type {UserModule.Repository['findUserById']} */
export const findUserById = async (id) => {
  const user = await User.findById(id);
  return user?.toObject();
};

/** @type {UserModule.Repository['updateUserById']} */
export const updateUserById = async (id, data) => {
  const user = await User.findById(id);
  if (!user) {
    return null;
  }
  const oldUser = structuredClone(user.toObject());
  Object.entries(data).forEach(([k, v]) => {
    user[k] = v;
  });
  const newUser = await user.save();
  return { old: oldUser, new: newUser.toObject() };
};

/** @type {UserModule.Repository['deleteUserById']} */
export const deleteUserById = async (id) => {
  const user = await User.findByIdAndDelete(id);
  return user?.toObject();
};
