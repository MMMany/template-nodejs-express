const { Schema } = require("mongoose");

const userSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    lastAccessedAt: { type: Date, required: true },
    createdAt: { type: Date, required: true, default: new Date() },
    updatedAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

module.exports = userSchema;
