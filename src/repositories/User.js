const { Model } = require("mongoose");
const userSchema = require("#/schema/userSchema");

/** @type {import('mongoose').Model} */
const User = new Model("User", userSchema);

module.exports = User;
