// src/routes/sample.js

import { Router } from "express";
import validateBody from "../middlewares/validateBody";
import Joi from "joi";

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

export default router;
