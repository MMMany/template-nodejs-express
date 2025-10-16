const { Model } = require("mongoose");
const UserSchema = require("#/schema/UserSchema");

/** @type {import('mongoose').Model} */
const User = new Model("User", UserSchema);

module.exports = User;
