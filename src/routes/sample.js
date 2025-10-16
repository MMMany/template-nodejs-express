const { Router } = require("express");
const validateBody = require("#/middlewares/validateBody");
const Joi = require("joi");

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post(
  "/",
  validateBody(
    Joi.object({
      message: Joi.string().required(),
    }),
  ),
  (req, res) => {
    const message = req.body.message;
    res.send(`message received : ${message}`);
  },
);

module.exports = router;
