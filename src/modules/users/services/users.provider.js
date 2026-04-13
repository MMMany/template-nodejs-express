/**
 * @typedef {import('../users.repository.js').UserRepository} UserRepository
 */

/**
 * @typedef {ReturnType<buildUserService>} UserService
 */

import { createUser } from "./create-user.service.js";
import { findUsers, findUserById } from "./find-user.service.js";
import { updateUserInfo, updateUserPermissions } from "./update-user.service.js";
import { deleteUser } from "./delete-user.service.js";

/**
 * @param {UserRepository} repository
 */
export const buildUserService = (repository) => ({
  createUser: createUser(repository),
  findUsers: findUsers(repository),
  findUserById: findUserById(repository),
  updateUserInfo: updateUserInfo(repository),
  updateUserPermissions: updateUserPermissions(repository),
  deleteUser: deleteUser(repository),
});
