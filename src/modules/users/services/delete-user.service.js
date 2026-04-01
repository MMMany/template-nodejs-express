/** @type {UserModule.ServiceGenerator['deleteUser']} */
export const deleteUser = (repository) => async (uid) => {
  const result = await repository.deleteUserById(uid);
  return result;
};
