/**
 * @typedef {import('../users.repository.js').UserRepository} UserRepository
 * @typedef {import('../users.dto.js').FindUsersQueryDTO} FindUsersQueryDTO
 */

/**
 * @param {UserRepository} repository
 */
export const findUsers =
  (repository) =>
  /**
   * @param {FindUsersQueryDTO} filter
   */
  async (filter) => {
    const result = await repository.findUsers(filter);
    return result;
  };

/**
 * @param {UserRepository} repository
 */
export const findUserById =
  (repository) =>
  /**
   * @param {string} id
   */
  async (id) => {
    const result = await repository.findUserById(id);
    return result;
  };
