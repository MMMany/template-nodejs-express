/** @type {UserModule.ServiceGenerator['createUser']} */
export const createUser = (repository) => async (data) => {
  const result = await repository.createUser(data);
  return result;
};
