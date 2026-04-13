/**
 * @typedef {import('../users.repository.js').UserRepository} UserRepository
 */

/**
 * @param {UserRepository} repository
 */
export const deleteUser =
  (repository) =>
  /**
   * @param {string} id
   */
  async (id) => {
    const result = await repository.deleteUserById(id);
    return result;
  };
