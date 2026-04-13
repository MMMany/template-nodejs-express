import { z } from "zod";

const userIdSchema = z.string().regex(/^[a-zA-Z0-9.-]{1,30}$/);

export const createUserDTO = z.object({
  userId: userIdSchema.nonempty(),
  password: z.string().nonempty(),
  email: z.email().nonempty(),
  name: z.string().nonempty(),
});
/**
 * @typedef {z.infer<typeof createUserDTO>} CreateUserDTO
 */

export const findUsersQuery = z.object({
  userId: userIdSchema.nullish(),
  name: z.string().nonempty().nullish(),
  email: z.email().nonempty().nullish(),
  permissions: z.union([z.string().nonempty(), z.array(z.string().nonempty())]).nullish(),
});
/**
 * @typedef {z.infer<typeof findUsersQuery>} FindUsersQueryDTO
 */

export const updateUserInfoDTO = z.object({
  name: z.string().nonempty().nullish(),
  email: z.email().nonempty().nullish(),
  password: z.string().nonempty().nullish(),
});
/**
 * @typedef {z.infer<typeof updateUserInfoDTO>} UpdateUserInfoDTO
 */

export const updateUserPermissionsDTO = z.object({
  add: z.array(z.string().nonempty()).nullish(),
  remove: z.array(z.string().nonempty()).nullish(),
});
/**
 * @typedef {z.infer<typeof updateUserPermissionsDTO>} UpdateUserPermissionsDTO
 */

export const idSchema = z.string().regex(/^[a-zA-Z0-9]{24}$/);
export const idParams = z.object({ id: idSchema });
/**
 * @typedef {z.infer<typeof idParams>} IdParams
 */
