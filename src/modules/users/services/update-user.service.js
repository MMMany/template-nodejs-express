const { union, difference, isEqual } = require("lodash");
const { responseSchema } = require("../users.dto");

/** @type {UserModule.UserService['updateUserInfo']} */
const updateUserInfo = ({ repository }) => {
  return async (uid, data) => {
    const result = await repository.updateUserById(uid, data);
    if (!result) {
      return null;
    }

    return Object.fromEntries(
      Object.entries(result).map(([k, v]) => {
        return [k, safeParse(v)];
      }),
    );
  };
};

/** @type {UserModule.UserService['updateUserPermissions']} */
const updateUserPermissions = ({ repository }) => {
  return async (uid, permsOperation) => {
    const oldUser = await repository.findUserById(uid);
    if (!oldUser) {
      return null;
    }

    const newPermissions = difference(union(oldUser.permissions, permsOperation.add), permsOperation.remove).toSorted();

    if (isEqual(oldUser.permissions, newPermissions)) {
      const parsed = safeParse(oldUser);
      return {
        old: parsed,
        new: parsed,
      };
    }

    const result = await repository.updateUserById(uid, { permissions: newPermissions.toSorted() });

    return Object.fromEntries(
      Object.entries(result).map(([k, v]) => {
        return [k, safeParse(v)];
      }),
    );
  };
};

function safeParse(doc) {
  const { data, error } = responseSchema.safeParse(doc);
  /* istanbul ignore if */
  if (error) {
    return null;
  }
  return data;
}

module.exports = {
  updateUserInfo,
  updateUserPermissions,
};
