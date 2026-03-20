/** @type {UserModule.UserService['createUser']} */
const createUser =
  ({ repository }) =>
  async (data) => {
    const result = await repository.createUser(data);
    return result;
  };

module.exports = {
  createUser,
};
