const crypto = require("crypto");
const { isArray } = require("lodash");

const generateSecureRandomString = (length) => {
  if (typeof length !== "number" || length <= 0) {
    throw new TypeError(`length must be a positive number, got ${typeof length}`);
  }

  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  const charsLength = chars.length;

  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    const idx = randomBytes[i] % charsLength;
    result += chars.charAt(idx);
  }

  return result;
};

const PERMISSIONS = Object.freeze(
  /** @type {const} */
  ({
    all: {
      read: "all:read",
    },
    feat1: {
      read: "feat1:read",
      write: "feat1:write",
    },
    auth: {
      read: "auth:read",
      write: "auth:write",
      update: "auth:update",
      delete: "auth:delete",
    },
    system: {
      admin: "system:admin",
    },
  }),
);

const ALL_PERMISSIONS = Object.freeze(Object.values(PERMISSIONS).flatMap((feat) => Object.values(feat)));

/**
 * @param {...string[]} rolePerms
 * @returns {Set<ALL_PERMISSIONS>}
 */
const getPermissions = (...rolePerms) => {
  return new Set(rolePerms.flatMap((it) => (isArray(it) ? it : [it])).filter((it) => ALL_PERMISSIONS.includes(it)));
};

module.exports = {
  generateSecureRandomString,
  PERMISSIONS,
  ALL_PERMISSIONS,
  getPermissions,
};
