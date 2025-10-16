const { Router } = require("express");
const validateBody = require("#/middlewares/validateBody");
const { signInSchema, signUpSchema } = require("#/validator/auth");
const authServices = require("#/services/auth");

const router = Router();

router.post("/sign-in", validateBody(signInSchema), authServices.signIn);
router.post("/sign-up", validateBody(signUpSchema), authServices.signUp);

module.exports = router;
