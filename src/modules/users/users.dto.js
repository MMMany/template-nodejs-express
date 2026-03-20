const z = require("zod");

const userIdSchema = z.string().regex(/^[a-zA-Z0-9.-]{1,30}$/);

const createUserDTO = z.object({
  userId: userIdSchema.nonempty(),
  password: z.string().nonempty(),
  email: z.email().nonempty(),
  name: z.string().nonempty(),
});

const findUsersQuery = z.object({
  userId: userIdSchema.nullish(),
  name: z.string().nonempty().nullish(),
  email: z.email().nonempty().nullish(),
  permissions: z.union([z.string().nonempty(), z.array(z.string().nonempty())]).nullish(),
});

const updateUserInfoDTO = z.object({
  name: z.string().nonempty().nullish(),
  email: z.email().nonempty().nullish(),
});

const updateUserPermissionsDTO = z.object({
  add: z.array(z.string().nonempty()).nullish(),
  remove: z.array(z.string().nonempty()).nullish(),
});

const idSchema = z.string().regex(/^[a-zA-Z0-9]{24}$/);

module.exports = {
  createUserDTO,
  findUsersQuery,
  updateUserInfoDTO,
  updateUserPermissionsDTO,
  idSchema,
};
