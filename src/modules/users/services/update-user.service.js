/**
 * @typedef {import('../users.repository.js').UserRepository} UserRepository
 * @typedef {import('../users.dto.js').UpdateUserInfoDTO} UpdateUserInfoDTO
 * @typedef {import('../users.dto.js').UpdateUserPermissionsDTO} UpdateUserPermissionsDTO
 */

import { union, difference, isEqual } from "lodash-es";

/**
 * @param {UserRepository} repository
 */
export const updateUserInfo =
  (repository) =>
  /**
   * @param {string} id
   * @param {UpdateUserInfoDTO} data
   */
  async (id, data) => {
    const result = await repository.updateUserById(id, data);
    return result;
  };

/**
 * @param {UserRepository} repository
 */
export const updateUserPermissions =
  (repository) =>
  /**
   * @param {string} id
   * @param {UpdateUserPermissionsDTO} permsOperation
   */
  async (id, permsOperation) => {
    const oldUser = await repository.findUserById(id);
    if (!oldUser) {
      return null;
    }

    /** @type {string[]} */
    const newPermissions = difference(union(oldUser.permissions, permsOperation.add), permsOperation.remove).toSorted(
      (a, b) => a.localeCompare(b),
    );

    if (isEqual(oldUser.permissions, newPermissions)) {
      return oldUser;
    }

    const result = await repository.updateUserById(id, {
      permissions: newPermissions.toSorted((a, b) => a.localeCompare(b)),
    });
    return result;
  };
