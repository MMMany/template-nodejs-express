import { Router } from "express";
import { z } from "zod";

//==========================================================================================
// Setup
//==========================================================================================
import * as repository from "./users.repository.js";
import { buildUserService } from "./services/users.provider.js";
import { buildUserController } from "./users.controller.js";

const service = buildUserService(repository);
const controller = buildUserController(service);

import { validateBody, validateQuery, validateParams } from "#src/shared/middlewares/validator.js";
import { createUserDTO, findUsersQuery, updateUserInfoDTO, idSchema, updateUserPermissionsDTO } from "./users.dto.js";
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
export const router = Router();

router.post("/", ...validator.create, controller.createUser);
router.get("/", ...validator.find, controller.findUsers);
router.get("/:id", ...validator.profile, controller.userProfile);
router.patch("/:id", ...validator.updateProfile, controller.updateUserInfo);
router.patch("/:id/permissions", ...validator.updatePermissions, controller.updateUserPermissions);
router.delete("/:id", ...validator.delete, controller.deleteUser);
