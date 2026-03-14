const { responseSchema } = require("../users.dto");

/** @type {UserModule.UserService['findUsers']} */
const findUsers = ({ repository }) => {
  return async (filter) => {
    const users = await repository.findUsers(filter);
    return users
      .map((it) => {
        const { data, error } = responseSchema.safeParse(it);
        /* istanbul ignore if */
        if (error) {
          return null;
        }
        return data;
      })
      .filter(Boolean);
  };
};

/** @type {UserModule.UserService['findUserByUid']} */
const findUserByUid = ({ repository }) => {
  return async (uid) => {
    const user = await repository.findUserById(uid);
    const { data: parsed, error } = await responseSchema.safeParseAsync(user);
    if (error) {
      return null;
    }
    return parsed;
  };
};

module.exports = {
  findUsers,
  findUserByUid,
};
