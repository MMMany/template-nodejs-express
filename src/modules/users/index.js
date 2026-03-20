const router = require("express").Router();
const z = require("zod");

//==========================================================================================
// Setup
//==========================================================================================
const repository = require("./users.repository");
const service = {
  createUser: require("./services").createUser({ repository }),
  findUsers: require("./services").findUsers({ repository }),
  findUserById: require("./services").findUserById({ repository }),
  updateUserInfo: require("./services").updateUserInfo({ repository }),
  updateUserPermissions: require("./services").updateUserPermissions({ repository }),
  deleteUser: require("./services").deleteUser({ repository }),
};
const controller = {
  createUser: require("./users.controller").createUser({ service: service.createUser }),
  findUsers: require("./users.controller").findUsers({ service: service.findUsers }),
  userProfile: require("./users.controller").userProfile({ service: service.findUserById }),
  updateUserInfo: require("./users.controller").updateUserInfo({ service: service.updateUserInfo }),
  updateUserPermissions: require("./users.controller").updateUserPermissions({
    service: service.updateUserPermissions,
  }),
  deleteUser: require("./users.controller").deleteUser({ service: service.deleteUser }),
};

const { validateBody, validateQuery, validateParams } = require("#/middlewares/validator");
const { createUserDTO, findUsersQuery, updateUserInfoDTO, idSchema, updateUserPermissionsDTO } = require("./users.dto");
const idParamsSchema = z.object({ id: idSchema });
const validator = {
  create: [validateBody(createUserDTO)],
  find: [validateQuery(findUsersQuery)],
  profile: [validateParams(idParamsSchema)],
  updateProfile: [validateParams(idParamsSchema), validateBody(updateUserInfoDTO)],
  updatePermissions: [validateParams(idParamsSchema), validateBody(updateUserPermissionsDTO)],
  delete: [validateParams(idParamsSchema)],
};

//==========================================================================================
// Routing
//==========================================================================================
router.post("/", ...validator.create, controller.createUser);
router.get("/", ...validator.find, controller.findUsers);
router.get("/:id", ...validator.profile, controller.userProfile);
router.patch("/:id", ...validator.updateProfile, controller.updateUserInfo);
router.patch("/:id/permissions", ...validator.updatePermissions, controller.updateUserPermissions);
router.delete("/:id", ...validator.delete, controller.deleteUser);

module.exports = {
  router,
};
