const { omit } = require("lodash");

/** @type {UserModule.UserService['deleteUser']} */
const deleteUser = ({ repository }) => {
  return async (uid) => {
    const user = await repository.deleteUserById(uid);
    return omit(user, ["id", "password", "updatedAt"]);
  };
};

module.exports = {
  deleteUser,
};
