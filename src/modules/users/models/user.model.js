const mongoose = require("mongoose");
const { IS_PRD } = require("#/utils/constants");

const transformOptions = {
  virtuals: true,
  getters: true,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

/** @type {UserModule.UserSchema} */
const schema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permissions: { type: [String], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
    strictQuery: true,
    // autoCreate는 프로덕션 환경에서는 false로 설정하는 것을 권장합니다.
    autoCreate: !IS_PRD,
    toJSON: transformOptions,
    toObject: transformOptions,
  },
);
schema.index({ name: 1 });

/** @type {UserModule.UserModel} */
const User = mongoose.models.User || mongoose.model("User", schema);

module.exports = User;
