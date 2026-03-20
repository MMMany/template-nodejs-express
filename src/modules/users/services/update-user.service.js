const { union, difference, isEqual } = require("lodash");

/** @type {UserModule.UserService['updateUserInfo']} */
const updateUserInfo =
  ({ repository }) =>
  async (id, data) => {
    const result = await repository.updateUserById(id, data);
    return result;
  };

/** @type {UserModule.UserService['updateUserPermissions']} */
const updateUserPermissions =
  ({ repository }) =>
  async (id, permsOperation) => {
    const oldUser = await repository.findUserById(id);
    if (!oldUser) {
      return null;
    }

    const newPermissions = difference(union(oldUser.permissions, permsOperation.add), permsOperation.remove).toSorted();

    if (isEqual(oldUser.permissions, newPermissions)) {
      return { old: oldUser, new: oldUser };
    }

    const result = await repository.updateUserById(id, { permissions: newPermissions.toSorted() });
    return result;
  };

module.exports = {
  updateUserInfo,
  updateUserPermissions,
};
