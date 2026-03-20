/** @type {UserModule.UserService['findUsers']} */
const findUsers =
  ({ repository }) =>
  async (filter) => {
    const result = await repository.findUsers(filter);
    return result;
  };

/** @type {UserModule.UserService['findUserById']} */
const findUserById =
  ({ repository }) =>
  async (id) => {
    const result = await repository.findUserById(id);
    return result;
  };

module.exports = {
  findUsers,
  findUserById,
};
