const z = require("zod");

//====================================================================
// Schema
//====================================================================

const uidSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-7[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/);
const userIdSchema = z.string().regex(/^[a-zA-Z0-9.-]{4,30}$/);
const passwordSchema = z
  .string()
  .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])[A-Za-z0-9~!@#$%^&*()_\-+=`{}|[\]\\:";'<>?,./]{8,50}$/);
const roleKeySchema = z.string().regex(/^[A-Z][A-Z_]{0,28}[A-Z]$/);

//====================================================================
// DTO
//====================================================================

const uidParams = z.object({ uid: uidSchema });
/** @typedef {z.infer<typeof uidParams>} UidParams */

const createUserDTO = z.object({
  userId: userIdSchema.nonempty(),
  password: passwordSchema.nonempty(),
  name: z.string().nonempty(),
  org: z.string().nonempty(),
  roles: z.array(roleKeySchema).nonempty(),
});
/** @typedef {z.infer<typeof createUserDTO>} CreateUserDTO */

const findUsersQuery = z.object({
  userId: userIdSchema.optional(),
  name: z.string().nonempty().optional(),
  org: z.string().nonempty().optional(),
});
/** @typedef {z.infer<typeof findUsersQuery>} FindUsersQuery */

const updateUserInfoDTO = z.object({
  name: z.string().nonempty().optional(),
  org: z.string().nonempty().optional(),
  roles: z.array(roleKeySchema).nonempty().optional(),
});
/** @typedef {z.infer<typeof updateUserInfoDTO>} UpdateUserInfoDTO */

const updatePasswordDTO = z.object({
  password: passwordSchema,
  resetCode: z.string().nonempty(),
});
/** @typedef {z.infer<typeof updatePasswordDTO>} UpdatePasswordDTO */

const userResponseDTO = z.object({
  uid: uidSchema,
  userId: userIdSchema,
  name: z.string().nonempty(),
  org: z.string().nonempty(),
  roles: z.array(roleKeySchema).nonempty(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
/** @typedef {z.infer<typeof userResponseDTO>} UserResponseDTO */

const createRoleDTO = z.object({
  key: roleKeySchema,
  name: z.string().nonempty(),
  desc: z.string().nonempty(),
  perms: z.array(z.string().nonempty()).nonempty(),
});
/** @typedef {z.infer<typeof createRoleDTO>} CreateRoleDTO */

const findRolesQuery = z.object({
  key: roleKeySchema.optional(),
  name: z.string().optional(),
  desc: z.string().optional(),
});
/** @typedef {z.infer<typeof findRolesQuery>} FindRolesQuery */

const roleKeyParams = z.object({ key: roleKeySchema });
/** @typedef {z.infer<typeof roleKeyParams>} RoleKeyParams */

const updateRoleDTO = z.object({
  name: z.string().nonempty().optional(),
  desc: z.string().nonempty().optional(),
  perms: z.array(z.string().nonempty()).nonempty().optional(),
});
/** @typedef {z.infer<typeof updateRoleDTO>} UpdateRoleDTO */

const roleResponseDTO = z.object({
  key: roleKeySchema,
  name: z.string().nonempty(),
  desc: z.string().nonempty(),
  perms: z.array(z.string().nonempty()).nonempty(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
/** @typedef {z.infer<typeof roleResponseDTO>} RoleResponseDTO */

const loginDTO = z.object({
  userId: userIdSchema,
  password: passwordSchema,
});
/** @typedef {z.infer<typeof loginDTO>} LoginDTO */

const loginResponseDTO = z.object({
  accessToken: z.string().nonempty(),
  user: userResponseDTO,
});
/** @typedef {z.infer<typeof loginResponseDTO>} LoginResponseDTO */

const findPermsQuery = z.object({
  search: z.string().optional(),
});
/** @typedef {z.infer<typeof findPermsQuery>} FindPermsQuery */

module.exports = {
  uidSchema,
  userIdSchema,
  passwordSchema,
  roleKeySchema,
  createUserDTO,
  updateUserInfoDTO,
  updatePasswordDTO,
  userResponseDTO,
  uidParams,
  findUsersQuery,
  createRoleDTO,
  findRolesQuery,
  roleKeyParams,
  updateRoleDTO,
  roleResponseDTO,
  loginDTO,
  loginResponseDTO,
  findPermsQuery,
};
