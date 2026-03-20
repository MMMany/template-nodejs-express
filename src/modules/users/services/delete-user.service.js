/** @type {UserModule.UserService['deleteUser']} */
const deleteUser =
  ({ repository }) =>
  async (uid) => {
    const result = await repository.deleteUserById(uid);
    return result;
  };

module.exports = {
  deleteUser,
};
