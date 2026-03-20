const User = require("./models/user.model");
const logger = require("#/utils/logger");
const { IS_DEV } = require("#/utils/constants");

/** @type {UserModule.UserRepository['createUser']} */
const createUser = async (data) => {
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

/** @type {UserModule.UserRepository['findUsers']} */
const findUsers = async (filter, projection = {}, options = {}) => {
  const users = await User.find(filter, projection, options);
  return users.map((it) => it?.toObject()).filter(Boolean);
};

/** @type {UserModule.UserRepository['findUserById']} */
const findUserById = async (id) => {
  const user = await User.findById(id);
  return user?.toObject();
};

/** @type {UserModule.UserRepository['updateUserById']} */
const updateUserById = async (id, data) => {
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

/** @type {UserModule.UserRepository['deleteUserById']} */
const deleteUserById = async (id) => {
  const user = await User.findByIdAndDelete(id);
  return user?.toObject();
};

module.exports = {
  createUser,
  findUsers,
  findUserById,
  updateUserById,
  deleteUserById,
};
