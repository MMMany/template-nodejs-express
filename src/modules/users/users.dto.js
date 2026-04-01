import { z } from "zod";

const userIdSchema = z.string().regex(/^[a-zA-Z0-9.-]{1,30}$/);

export const createUserDTO = z.object({
  userId: userIdSchema.nonempty(),
  password: z.string().nonempty(),
  email: z.email().nonempty(),
  name: z.string().nonempty(),
});

export const findUsersQuery = z.object({
  userId: userIdSchema.nullish(),
  name: z.string().nonempty().nullish(),
  email: z.email().nonempty().nullish(),
  permissions: z.union([z.string().nonempty(), z.array(z.string().nonempty())]).nullish(),
});

export const updateUserInfoDTO = z.object({
  name: z.string().nonempty().nullish(),
  email: z.email().nonempty().nullish(),
});

export const updateUserPermissionsDTO = z.object({
  add: z.array(z.string().nonempty()).nullish(),
  remove: z.array(z.string().nonempty()).nullish(),
});

export const idSchema = z.string().regex(/^[a-zA-Z0-9]{24}$/);
