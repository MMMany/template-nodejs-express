/**
 * @typedef {import('../users.repository.js').UserRepository} UserRepository
 * @typedef {import('../users.dto.js').CreateUserDTO} CreateUserDTO
 */

/**
 * @param {UserRepository} repository
 */
export const createUser =
  (repository) =>
  /**
   * @param {CreateUserDTO} data
   */
  async (data) => {
    const result = await repository.createUser(data);
    return result;
  };
