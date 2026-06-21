const router = require("express").Router();

const repository = require("./auth.repository")();
const service = require("./auth.service")(repository);
const controller = require("./auth.controller")(service);

const { validateBody, validateQuery, validateParams } = require("#/middlewares/validator");
const {
  createUserDTO,
  uidParams,
  findUsersQuery,
  updateUserInfoDTO,
  updatePasswordDTO,
  createRoleDTO,
  findRolesQuery,
  roleKeyParams,
  findPermsQuery,
  loginDTO,
} = require("./auth.dto");
const { validateAuth } = require("#/middlewares/auth.middleware");
const { PERMISSIONS } = require("./auth.utils");

router.post("/users", validateAuth(PERMISSIONS.system.admin), validateBody(createUserDTO), controller.createUser);
router.get("/users", validateAuth(PERMISSIONS.auth.read), validateQuery(findUsersQuery), controller.findUsers);
router.get("/users/:uid", validateParams(uidParams), controller.getUser);
router.patch("/users/:uid", validateParams(uidParams), validateBody(updateUserInfoDTO), controller.updateUserInfo);
router.post(
  "/users/:uid/reset-password",
  validateParams(uidParams),
  validateBody(updatePasswordDTO),
  controller.updatePassword,
);
router.delete("/users/:uid", validateAuth(PERMISSIONS.system.admin), validateParams(uidParams), controller.deleteUser);
router.post("/roles", validateAuth(PERMISSIONS.auth.write), validateBody(createRoleDTO), controller.createRole);
router.get("/roles", validateAuth(PERMISSIONS.auth.read), validateQuery(findRolesQuery), controller.findRoles);
router.get("/roles/:key", validateAuth(PERMISSIONS.auth.read), validateParams(roleKeyParams), controller.getRole);
router.patch(
  "/roles/:key",
  validateAuth(PERMISSIONS.auth.update),
  validateParams(roleKeyParams),
  controller.updateRole,
);
router.delete(
  "/roles/:key",
  validateAuth(PERMISSIONS.auth.delete),
  validateParams(roleKeyParams),
  controller.deleteRole,
);
router.get("/perms", validateAuth(PERMISSIONS.auth.read), validateQuery(findPermsQuery), controller.findPermissions);
router.post("/login", validateBody(loginDTO), controller.login);
router.post("/logout", validateAuth(), controller.logout);
router.post("/refresh-token", controller.refreshToken);
router.post("/logout-all", validateAuth(), controller.logoutAllDevice);

module.exports = {
  router,
};
