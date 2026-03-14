const { responseSchema } = require("../users.dto");

/** @type {UserModule.UserService['createUser']} */
const createUser = ({ repository }) => {
  return async (data) => {
    const user = await repository.createUser(data);
    const { data: parsed, error } = await responseSchema.safeParseAsync(user);
    /* istanbul ignore if */
    if (error) {
      return null;
    }
    return parsed;
  };
};

module.exports = {
  createUser,
};
