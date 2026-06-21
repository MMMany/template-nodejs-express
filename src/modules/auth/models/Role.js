const mongoose = require("mongoose");
const { IS_PRD } = require("#/utils/constants");

/**
 * @typedef {object} Role
 * @property {string} key
 * @property {string} name
 * @property {string} desc
 * @property {string[]} perms
 * @property {string} status
 * @property {Date} createdAt - Mongoose auto-create
 * @property {Date} updatedAt - Mongoose auto-create
 */

/** @type {import('mongoose').ToObjectOptions<Role>} */
const transformOptions = {
  virtuals: true,
  getters: true,
  transform: (_doc, { _id, __v, ...others }) => {
    return others;
  },
};

/** @type {import('mongoose').Schema<Role>} */
const schema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true, index: true },
    desc: { type: String, required: true },
    perms: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "DELETE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strictQuery: true,
    autoCreate: !IS_PRD,
    autoIndex: !IS_PRD,
    toJSON: transformOptions,
    toObject: transformOptions,
  },
);

/** @type {import('mongoose').Model<Role>} */
const Role = mongoose.models.Role || mongoose.model("Role", schema, "auth-roles");

module.exports = Role;
