const mongoose = require("mongoose");
const { IS_PRD } = require("#/utils/constants");

/** @type {UserModule.UserSchema} */
const schema = new mongoose.Schema(
  {
    // uid: { type: String, required: true, unique: true },
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
    toJSON: {
      virtuals: true,
      getters: true,
      // transform: (_doc, ret) => {
      //   return {
      //     uid: ret.id,
      //     userId: ret.userId,
      //     name: ret.name,
      //     email: ret.email,
      //     permissions: ret.permissions,
      //     createdAt: ret.createdAt,
      //   };
      // },
    },
    toObject: {
      virtuals: true,
      getters: true,
      // transform: (doc, ret) => {
      //   return {
      //     ...ret,
      //     uid: ret.id,
      //   };
      // },
    },
  },
);
schema.virtual("uid").get(function () {
  return this.id;
});

/** @type {UserModule.UserModel} */
const User = mongoose.models.User || mongoose.model("User", schema);

module.exports = User;
