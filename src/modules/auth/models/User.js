const mongoose = require("mongoose");
const { IS_PRD } = require("#/utils/constants");

/**
 * @typedef {object} User
 * @property {string} uid - Unique ID (UUIDv7)
 * @property {string} userId
 * @property {string} password
 * @property {string} name
 * @property {string} org
 * @property {string[]} roles
 * @property {string} resetCode
 * @property {number} tokenVersion
 * @property {string} status
 * @property {Date} createdAt - Mongoose auto-create
 * @property {Date} updatedAt - Mongoose auto-create
 */

/** @type {import('mongoose').ToObjectOptions<User>} */
const transformOptions = {
  virtuals: true,
  getters: true,
  transform: (_doc, { _id, __v, ...others }) => {
    return others;
  },
};

/** @type {import('mongoose').Schema<User>} */
const schema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, index: true, trim: true },
    org: { type: String, required: true, trim: true },
    roles: { type: [String], default: [] },
    resetCode: { type: String, default: "" },
    tokenVersion: { type: Number, default: 0 },
    status: { type: String, enum: ["ACTIVE", "INACTIVE", "DELETE"], default: "ACTIVE" },
  },
  {
    timestamps: true,
    versionKey: false,
    strictQuery: true,
    // autoCreate는 프로덕션 환경에서는 false로 설정하는 것을 권장합니다.
    autoCreate: !IS_PRD,
    autoIndex: !IS_PRD,
    toJSON: transformOptions,
    toObject: transformOptions,
  },
);
schema.index({ name: 1, org: 1 });

/** @type {import('mongoose').Model<User>} */
const User = mongoose.models.User || mongoose.model("User", schema, "auth-users");

/**
 * @typedef {import('mongoose').HydratedDocument<User>} UserDocument
 */

module.exports = User;
