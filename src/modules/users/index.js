const router = require("express").Router();

const controller = require("./users.controller");
const repository = require("./users.repository");
const createUserService = require("./services/create-user.service");
const findUserService = require("./services/find-user.service");
const updateUserService = require("./services/update-user.service");
const deleteUserService = require("./services/delete-user.service");

const { validateBody, validateQuery, validateParams } = require("#/middlewares/validator");

const dto = require("./users.dto");

router.post(
  "/",
  validateBody(dto.createUserDTO),
  controller.createUser({ service: createUserService.createUser({ repository }) }),
);
router.get(
  "/",
  validateQuery(dto.findUsersDTO),
  controller.findUsers({ service: findUserService.findUsers({ repository }) }),
);
router.get(
  "/:uid",
  validateParams(dto.uidParamsSchema),
  controller.userProfile({ service: findUserService.findUserByUid({ repository }) }),
);
router.patch(
  "/:uid",
  validateParams(dto.uidParamsSchema),
  validateBody(dto.updateUserInfoDTO.nullish()),
  controller.updateUserInfo({ service: updateUserService.updateUserInfo({ repository }) }),
);
router.patch(
  "/:uid/permissions",
  validateParams(dto.uidParamsSchema),
  validateBody(dto.updateUserPermissionsDTO.nullish()),
  controller.updateUserPermissions({ service: updateUserService.updateUserPermissions({ repository }) }),
);
router.delete(
  "/:uid",
  validateParams(dto.uidParamsSchema),
  controller.deleteUser({ service: deleteUserService.deleteUser({ repository }) }),
);

module.exports = {
  router,
  userProfileService: findUserService.findUserByUid({ repository }),
};
