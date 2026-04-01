/** @type {UserModule.ServiceGenerator['findUsers']} */
export const findUsers = (repository) => async (filter) => {
  const result = await repository.findUsers(filter);
  return result;
};

/** @type {UserModule.ServiceGenerator['findUserById']} */
export const findUserById = (repository) => async (id) => {
  const result = await repository.findUserById(id);
  return result;
};
